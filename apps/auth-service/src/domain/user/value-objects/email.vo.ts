export class Email {
  private constructor(private readonly _value: string) {}

  public static create(value: string): Email {
    const trimmed = value.trim().toLowerCase();

    if (!trimmed) {
      throw new Error('Email is required.');
    }

    // validação simples, sem virar regex hell
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      throw new Error('Invalid email format.');
    }

    return new Email(trimmed);
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: Email): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
