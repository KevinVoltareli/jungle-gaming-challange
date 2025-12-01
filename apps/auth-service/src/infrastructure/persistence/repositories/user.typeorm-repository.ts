import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IUserRepository } from '../../../domain/user/user-repository.interface';
import { User } from '../../../domain/user/user.entity';
import { Email } from '../../../domain/user/value-objects/email.vo';
import { UserOrmEntity } from '../typeorm/entities/user.orm-entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly ormRepo: Repository<UserOrmEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    if (!entity) return null;
    return UserMapper.toDomain(entity);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const entity = await this.ormRepo.findOne({
      where: { email: email.value },
    });
    if (!entity) return null;
    return UserMapper.toDomain(entity);
  }

  async findAll(): Promise<User[]> {
    const ormUsers = await this.ormRepo.find();
    return ormUsers.map((orm) => UserMapper.toDomain(orm));
  }

  async findByUsername(username: string): Promise<User | null> {
    const entity = await this.ormRepo.findOne({ where: { username } });
    if (!entity) return null;
    return UserMapper.toDomain(entity);
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.ormRepo.count({ where: { email: email.value } });
    return count > 0;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const count = await this.ormRepo.count({ where: { username } });
    return count > 0;
  }

  async save(user: User): Promise<void> {
    const entity = UserMapper.toOrm(user);
    await this.ormRepo.save(entity);
  }
}
