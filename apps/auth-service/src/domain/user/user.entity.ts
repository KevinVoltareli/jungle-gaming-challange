import { Email } from './value-objects/email.vo';
import { PasswordHash } from './value-objects/password-hash.vo';
import { UserRole } from './user-role.enum';

export interface UserProps {
  id: string;
  email: Email;
  username: string;
  passwordHash: PasswordHash;
  roles: UserRole[];
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private _id: string;
  private _email: Email;
  private _username: string;
  private _passwordHash: PasswordHash;
  private _roles: UserRole[];
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: UserProps) {
    this._id = props.id;
    this._email = props.email;
    this._username = props.username;
    this._passwordHash = props.passwordHash;
    this._roles = props.roles.length ? [...props.roles] : [UserRole.USER];
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.ensureValidState();
  }

  /**
   * Fábrica para criação de um novo usuário
   * (ex: na hora do registro)
   */
  public static createNew(params: {
    id: string;
    email: Email;
    username: string;
    passwordHash: PasswordHash;
  }): User {
    const now = new Date();

    return new User({
      id: params.id,
      email: params.email,
      username: params.username.trim(),
      passwordHash: params.passwordHash,
      roles: [UserRole.USER],
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Fábrica para reidratar usuário já existente do banco
   */
  public static rehydrate(props: UserProps): User {
    return new User(props);
  }

  // ======= Invariantes de domínio =======

  private ensureValidState(): void {
    if (!this._id) {
      throw new Error('User id is required.');
    }

    if (!this._username || this._username.trim().length < 3) {
      throw new Error('Username must have at least 3 characters.');
    }

    if (!this._email) {
      throw new Error('Email is required.');
    }

    if (!this._passwordHash) {
      throw new Error('Password hash is required.');
    }

    if (!this._createdAt || !this._updatedAt) {
      throw new Error('Timestamps are required.');
    }
  }

  // ======= Getters =======

  public get id(): string {
    return this._id;
  }

  public get email(): Email {
    return this._email;
  }

  public get username(): string {
    return this._username;
  }

  public get passwordHash(): PasswordHash {
    return this._passwordHash;
  }

  public get roles(): ReadonlyArray<UserRole> {
    return this._roles;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  // ======= Métodos de comportamento =======

  public changeUsername(newUsername: string): void {
    const trimmed = newUsername.trim();
    if (trimmed.length < 3) {
      throw new Error('Username must have at least 3 characters.');
    }
    this._username = trimmed;
    this.touch();
  }

  public changeEmail(newEmail: Email): void {
    this._email = newEmail;
    this.touch();
  }

  public changePassword(newPasswordHash: PasswordHash): void {
    this._passwordHash = newPasswordHash;
    this.touch();
  }

  public addRole(role: UserRole): void {
    if (!this._roles.includes(role)) {
      this._roles.push(role);
      this.touch();
    }
  }

  public removeRole(role: UserRole): void {
    if (role === UserRole.USER) {
      // garante pelo menos USER
      return;
    }
    this._roles = this._roles.filter((r) => r !== role);
    this.touch();
  }

  public hasRole(role: UserRole): boolean {
    return this._roles.includes(role);
  }

  private touch(): void {
    this._updatedAt = new Date();
    this.ensureValidState();
  }
}
