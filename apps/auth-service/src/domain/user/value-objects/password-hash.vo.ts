export class PasswordHash {
  private constructor(private readonly _value: string) {}

  /**
   * Cria um PasswordHash a partir de um valor já hasheado.
   * A responsabilidade de hashear está em outro serviço.
   */
  public static fromHash(hash: string): PasswordHash {
    const trimmed = hash.trim();

    if (!trimmed) {
      throw new Error('Password hash is required.');
    }

    // bcrypt normalmente tem ~60 caracteres, mas vamos só checar um mínimo
    if (trimmed.length < 20) {
      throw new Error('Password hash seems too short.');
    }

    return new PasswordHash(trimmed);
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: PasswordHash): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
