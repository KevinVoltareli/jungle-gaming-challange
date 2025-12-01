import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtTokenService } from '../../application/ports/jwt-token.interface';

@Injectable()
export class JwtAdapter implements IJwtTokenService {
  constructor(private readonly jwt: JwtService) {}

  private getAccessTokenTtl(): number {
    const raw = process.env.ACCESS_TOKEN_TTL;
    if (!raw) return 900; // 15 min
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? 900 : parsed;
  }

  private getRefreshTokenTtl(): number {
    const raw = process.env.REFRESH_TOKEN_TTL;
    if (!raw) return 60 * 60 * 24 * 7; // 7 days
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? 60 * 60 * 24 * 7 : parsed;
  }

  signAccessToken(payload: any): string {
    return this.jwt.sign(payload, {
      expiresIn: this.getAccessTokenTtl(),
    });
  }

  signRefreshToken(payload: any): string {
    return this.jwt.sign(payload, {
      expiresIn: this.getRefreshTokenTtl(),
    });
  }

  verifyRefreshToken(token: string): any {
    return this.jwt.verify(token);
  }
}
