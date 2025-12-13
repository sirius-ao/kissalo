import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

export const currentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const userId = request.headers['intern-user'];
    if (!userId) {
      throw new UnauthorizedException('Usuário não indefificado');
    }
    return Number(userId);
  },
);
