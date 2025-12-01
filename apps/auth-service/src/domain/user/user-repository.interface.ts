import { User } from './user.entity';
import { Email } from './value-objects/email.vo';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;

  /**
   * Verificar se já existe usuário com email ou username
   */
  existsByEmail(email: Email): Promise<boolean>;
  existsByUsername(username: string): Promise<boolean>;

  /**
   * Salva um usuário (novo ou atualizado).
   */
  save(user: User): Promise<void>;
}
