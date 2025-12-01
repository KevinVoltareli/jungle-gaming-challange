import { Injectable, UnauthorizedException } from '@nestjs/common';
import { NestJwtTokenService } from '../../../infrastructure/jwt/jwt-token.service';

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  userId: string;
  email: string;
  username: string;
}

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly jwtTokenService: NestJwtTokenService, // 👈 classe concreta, nada de interface
  ) {}

  async execute(input: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    try {
      // decodamos o refresh token
      const payload = this.jwtTokenService.verifyRefreshToken(
        input.refreshToken,
      );

      return {
        userId: payload.sub,
        email: payload.email,
        username: payload.username,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
