import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ConflictException } from '@nestjs/common';
import { RegisterUserService } from './register-user.service';
import { IUserRepository } from '../../../domain/user/user-repository.interface';
import { IPasswordHasher } from '../../ports/password-hasher.interface';
import { IIdGenerator } from '../../ports/id-generator.interface';
import { Email } from '../../../domain/user/value-objects/email.vo';

describe('RegisterUserService', () => {
  let service: RegisterUserService;
  let userRepository: jest.Mocked<IUserRepository>;
  let passwordHasher: jest.Mocked<IPasswordHasher>;
  let idGenerator: jest.Mocked<IIdGenerator>;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      existsByEmail: jest.fn(),
      existsByUsername: jest.fn(),
      save: jest.fn(),
    };

    passwordHasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    idGenerator = {
      generate: jest.fn(),
    };

    service = new RegisterUserService(
      userRepository,
      passwordHasher,
      idGenerator,
    );
  });

  it('should register a new user when email and username are free', async () => {
    userRepository.existsByEmail.mockResolvedValue(false);
    userRepository.existsByUsername.mockResolvedValue(false);

    passwordHasher.hash.mockResolvedValue(
      'hashed_password_very_long_fake_value_1234567890',
    );
    idGenerator.generate.mockReturnValue('generated-id');

    const result = await service.execute({
      email: 'test@example.com',
      username: 'kevin',
      password: '123456',
    });

    expect(userRepository.existsByEmail).toHaveBeenCalledWith(
      Email.create('test@example.com'),
    );
    expect(userRepository.existsByUsername).toHaveBeenCalledWith('kevin');
    expect(passwordHasher.hash).toHaveBeenCalledWith('123456');
    expect(userRepository.save).toHaveBeenCalled();
    expect(result).toEqual({
      id: 'generated-id',
      email: 'test@example.com',
      username: 'kevin',
      createdAt: expect.any(Date),
    });
  });

  it('should throw ConflictException if email already exists', async () => {
    userRepository.existsByEmail.mockResolvedValue(true);
    userRepository.existsByUsername.mockResolvedValue(false);

    await expect(
      service.execute({
        email: 'test@example.com',
        username: 'kevin',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(userRepository.save).not.toHaveBeenCalled();
  });
});
