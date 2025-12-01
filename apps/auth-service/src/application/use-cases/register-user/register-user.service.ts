import { ConflictException, Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../../domain/user/user-repository.interface';
import { IPasswordHasher } from '../../ports/password-hasher.interface';
import { IIdGenerator } from '../../ports/id-generator.interface';
import { Email } from '../../../domain/user/value-objects/email.vo';
import { User } from '../../../domain/user/user.entity';
import { PasswordHash } from '../../../domain/user/value-objects/password-hash.vo';

export interface RegisterUserInput {
  email: string;
  username: string;
  password: string;
}

export interface RegisterUserOutput {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
}

@Injectable()
export class RegisterUserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,

    @Inject('IPasswordHasher')
    private readonly passwordHasher: IPasswordHasher,

    @Inject('IIdGenerator')
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const email = Email.create(input.email);

    const emailExists = await this.userRepository.existsByEmail(email);
    if (emailExists) {
      throw new ConflictException('Email already in use');
    }

    const usernameExists = await this.userRepository.existsByUsername(
      input.username,
    );
    if (usernameExists) {
      throw new ConflictException('Username already in use');
    }

    const hash = await this.passwordHasher.hash(input.password);
    const passwordHash = PasswordHash.fromHash(hash);

    const id = this.idGenerator.generate();

    const user = User.createNew({
      id,
      email,
      username: input.username,
      passwordHash,
    });

    await this.userRepository.save(user);

    return {
      id: user.id,
      email: user.email.value,
      username: user.username,
      createdAt: user.createdAt,
    };
  }
}
