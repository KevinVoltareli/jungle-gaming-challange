import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';

import { UserOrmEntity } from '../infrastructure/persistence/typeorm/entities/user.orm-entity';
import { UserTypeOrmRepository } from '../infrastructure/persistence/repositories/user.typeorm-repository';

import { BcryptPasswordHasher } from '../infrastructure/security/bcrypt-password-hasher.adapter';
import { UuidGenerator } from '../infrastructure/ids/uuid-generator.adapter';
import { NestJwtTokenService } from '../infrastructure/jwt/jwt-token.service';

import { RegisterUserService } from '../application/use-cases/register-user/register-user.service';
import { LoginUserService } from '../application/use-cases/login-user/login-user.service';
import { GenerateTokensService } from '../application/use-cases/generate-tokens/generate-tokens.service';
import { RefreshTokenService } from '../application/use-cases/refresh-token/refresh-token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),

    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET ?? 'supersecretaccess',
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Infra/domain adapters
    { provide: 'IUserRepository', useClass: UserTypeOrmRepository },
    { provide: 'IPasswordHasher', useClass: BcryptPasswordHasher },
    { provide: 'IIdGenerator', useClass: UuidGenerator },
    NestJwtTokenService,

    // Use cases
    RegisterUserService,
    LoginUserService,
    GenerateTokensService,
    RefreshTokenService,
    UserTypeOrmRepository,
  ],
  exports: [UserTypeOrmRepository],
})
export class AuthModule {}
