import { Injectable } from '@nestjs/common';
import { NestJwtTokenService } from '../../../infrastructure/jwt/jwt-token.service';

export interface GenerateTokensInput {
  userId: string;
  email: string;
  username: string;
}

export interface GenerateTokensOutput {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class GenerateTokensService {
  constructor(
    private readonly jwtTokenService: NestJwtTokenService, // 👈 injeta a classe concreta
  ) {}

  execute(input: GenerateTokensInput): GenerateTokensOutput {
    const payload = {
      sub: input.userId,
      email: input.email,
      username: input.username,
    };

    const accessToken = this.jwtTokenService.signAccessToken(payload);
    const refreshToken = this.jwtTokenService.signRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }
}
