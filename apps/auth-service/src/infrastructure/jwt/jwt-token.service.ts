import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtTokenService } from '../../application/ports/jwt-token.interface';

@Injectable()
export class NestJwtTokenService implements IJwtTokenService {
  constructor(private readonly jwt: JwtService) {}

  signAccessToken(payload: any): string {
    // exp padrão, mas o ideal é vir da config
    return this.jwt.sign(payload, { expiresIn: '15m' });
  }

  signRefreshToken(payload: any): string {
    return this.jwt.sign(payload, { expiresIn: '7d' });
  }

  verifyRefreshToken(token: string): any {
    return this.jwt.verify(token);
  }
}
