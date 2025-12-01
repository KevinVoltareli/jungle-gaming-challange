import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';

import { IUserRepository } from '../../../domain/user/user-repository.interface';
import { IPasswordHasher } from '../../ports/password-hasher.interface';
import { Email } from '../../../domain/user/value-objects/email.vo';
import { User } from '../../../domain/user/user.entity';

export interface LoginUserInput {
  emailOrUsername: string;
  password: string;
}

export interface LoginUserOutput {
  user: User;
}

@Injectable()
export class LoginUserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,

    @Inject('IPasswordHasher')
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    const { emailOrUsername, password } = input;

    let user: User | null = null;

    // se tiver "@", tratamos como email, senão como username
    if (emailOrUsername.includes('@')) {
      const email = Email.create(emailOrUsername);
      user = await this.userRepository.findByEmail(email);
    } else {
      user = await this.userRepository.findByUsername(emailOrUsername);
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.passwordHasher.compare(
      password,
      user.passwordHash.value,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { user };
  }
}
