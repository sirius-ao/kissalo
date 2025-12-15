import {
  BadGatewayException,
  ForbiddenException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class IsAuthenticatedMiddlware implements NestMiddleware {
  private readonly jwt: JwtService = new JwtService({
    secret: process.env.JWT_SECRET,
  });

  public async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new BadGatewayException('Authentication Header não informado');
    }
    const [_, token] = authHeader.split(' ');
    if (!token) {
      throw new BadGatewayException('TOken Header não informado');
    }
    try {
      const tokenData = this.jwt.verify(token) as {
        sub: number;
      };
      req.headers['intern-user'] = String(tokenData.sub);
      next();
    } catch (error) {
      throw new ForbiddenException('token inválido ou expirado');
    }
  }
}
