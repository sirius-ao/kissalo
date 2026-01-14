import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { IsClientGuard } from '@core/http/guards/isClient.guard';
import { currentUser } from '@core/http/decorators/currentUser.decorator';
import { IsAdminGuard } from '@core/http/guards/isAdmin.guard';
import { IsEmailVerifiedGuard } from '@core/http/guards/isEmailVerifiedGuard';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@ApiTags('Payments V1')
@ApiBearerAuth()
@UseGuards(IsEmailVerifiedGuard)
@Controller('v1/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':id/consolidate')
  @UseGuards(IsAdminGuard)
  @ApiOperation({
    summary: 'Criar consolidação de um pagamento',
  })
  @ApiResponse({
    status: 403,
    description: 'Apenas clientes podem criar pagamentos',
  })
  consolidate(
    @currentUser() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.paymentsService.consolidate(id);
  }

  @Patch(':id/toogle')
  @UseGuards(IsAdminGuard)
  @ApiOperation({
    summary: 'Atualizar um pagamento',
    description: 'Permite atualizar dados de um pagamento status',
  })
  @ApiParam({ name: 'id', example: 1 })
  update(
    @Body() UpdatePaymentDto: UpdatePaymentDto,
    @currentUser() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.paymentsService.update(UpdatePaymentDto, userId, id);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar pagamentos',
    description: 'Lista pagamentos do usuário ou todos se for admin',
  })
  findAll(@currentUser() userId: number) {
    return this.paymentsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar pagamento por ID',
    description:
      'Retorna os detalhes de um pagamento específico se o usuário tiver permissão',
  })
  @ApiParam({ name: 'id', example: 1 })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @currentUser() userId: number,
  ) {
    return this.paymentsService.findOne(id, userId);
  }
}
