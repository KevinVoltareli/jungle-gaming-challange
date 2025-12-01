export class TaskDescription {
  private constructor(private readonly _value: string | null) {}

  get value(): string | null {
    return this._value;
  }

  static create(raw: string | null | undefined): TaskDescription {
    if (!raw) {
      return new TaskDescription(null);
    }

    const trimmed = raw.trim();

    if (trimmed.length === 0) {
      return new TaskDescription(null);
    }

    if (trimmed.length > 2000) {
      throw new Error('Task description must be at most 2000 characters long.');
    }

    return new TaskDescription(trimmed);
  }
}
