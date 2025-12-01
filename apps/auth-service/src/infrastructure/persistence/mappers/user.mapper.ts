import { User } from '../../../domain/user/user.entity';
import { Email } from '../../../domain/user/value-objects/email.vo';
import { PasswordHash } from '../../../domain/user/value-objects/password-hash.vo';
import { UserRole } from '../../../domain/user/user-role.enum';
import { UserOrmEntity } from '../typeorm/entities/user.orm-entity';

export class UserMapper {
  static toDomain(entity: UserOrmEntity): User {
    return User.rehydrate({
      id: entity.id,
      email: Email.create(entity.email),
      username: entity.username,
      passwordHash: PasswordHash.fromHash(entity.passwordHash),
      roles: entity.roles.map((role) => role as UserRole),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toOrm(user: User): UserOrmEntity {
    const orm = new UserOrmEntity();

    orm.id = user.id;
    orm.email = user.email.value;
    orm.username = user.username;
    orm.passwordHash = user.passwordHash.value;
    orm.roles = user.roles.map((r) => r.toString());
    orm.createdAt = user.createdAt;
    orm.updatedAt = user.updatedAt;

    return orm;
  }
}
