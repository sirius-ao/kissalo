import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserNotFoundExecption } from '../erros/user.error';

export const currentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const userId = request.headers['intern-user'];
    if (!userId) {
      throw new UserNotFoundExecption();
    }
    return Number(userId);
  },
);
