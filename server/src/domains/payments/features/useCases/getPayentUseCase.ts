import PrismaService from '@infra/database/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';

export class GetPaymentUseCase {
  constructor(private readonly prisma: PrismaService) {}
  async getOne(paymentId: number, userId: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          include: {
            service: true,
          },
        },
        client: true,
        professional: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const allowed =
      user.role === UserRole.ADMIN ||
      payment.clientId === userId ||
      payment.professional.userId === userId;

    if (!allowed) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este pagamento',
      );
    }

    return payment;
  }
  async getAllMyPayments(userId: number, page: number, limit: number) {
    page = isNaN(page) || page == 0 ? 1 : page;
    limit = isNaN(limit) || limit == 0 ? 10 : limit;
    const skip = (page - 1) * limit;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('Usuário não encontrado');
    let where: Prisma.PaymentWhereInput = {};
    if (user.role === UserRole.CUSTOMER) {
      where = { clientId: userId };
    } else if (user.role === UserRole.PROFESSIONAL) {
      where = {
        professional: {
          userId,
        },
      };
    } else if (user.role === UserRole.ADMIN) {
      where = {};
    }

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        include: {
          booking: {
            include: {
              service: true,
            },
          },
          client: true,
          professional: {
            include: {
              user: {
                omit: {
                  password: true,
                },
              },
            },
          },
          conclidation: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);
    const totalPages = Math.ceil(total / limit);
    const [stats, totalAmount] = await Promise.all([
      this.prisma.payment.groupBy({
        by: ['status'],
        _count: { _all: true },
        where,
      }),
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where,
      }),
    ]);

    const detailedStats = stats.reduce(
      (acc, stat) => {
        acc[stat.status.toLowerCase()] = stat._count._all;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      data: payments,
      stats: {
        total: total,
        totalAmount: totalAmount._sum.amount ?? 0,
        ...detailedStats,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }
}
