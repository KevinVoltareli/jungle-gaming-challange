import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

import { RegisterUserService } from '../application/use-cases/register-user/register-user.service';
import { LoginUserService } from '../application/use-cases/login-user/login-user.service';
import { GenerateTokensService } from '../application/use-cases/generate-tokens/generate-tokens.service';
import { RefreshTokenService } from '../application/use-cases/refresh-token/refresh-token.service';
import { UserTypeOrmRepository } from '../infrastructure/persistence/repositories/user.typeorm-repository';
import { User } from '../domain/user/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserService: RegisterUserService,
    private readonly loginUserService: LoginUserService,
    private readonly generateTokensService: GenerateTokensService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly usersRepo: UserTypeOrmRepository,
  ) {}

  // 🔹 NOVO ENDPOINT: listar usuários
  @Get('users')
  @ApiOperation({ summary: 'Listar usuários' })
  async listUsers() {
    const users: User[] = await this.usersRepo.findAll();

    // devolve um DTO limpinho pro front
    return users.map((user) => ({
      id: user.id,
      email: user.email.value,
      username: user.username,
      roles: user.roles ?? [],
    }));
  }

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    const result = await this.registerUserService.execute({
      email: dto.email,
      username: dto.username,
      password: dto.password,
    });

    const tokens = this.generateTokensService.execute({
      userId: result.id,
      email: result.email,
      username: result.username,
    });

    return {
      ...tokens,
      user: result,
    };
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    const { user } = await this.loginUserService.execute({
      emailOrUsername: dto.emailOrUsername,
      password: dto.password,
    });

    const tokens = this.generateTokensService.execute({
      userId: user.id,
      email: user.email.value,
      username: user.username,
    });

    return {
      ...tokens,
      user,
    };
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    const payload = await this.refreshTokenService.execute({
      refreshToken: dto.refreshToken,
    });

    const tokens = this.generateTokensService.execute({
      userId: payload.userId,
      email: payload.email,
      username: payload.username,
    });

    return tokens;
  }
}
