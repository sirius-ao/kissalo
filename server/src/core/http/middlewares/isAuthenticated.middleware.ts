import {
  BadGatewayException,
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
    
  }
}
