export class TaskTitle {
  private constructor(private readonly _value: string) {}

  get value(): string {
    return this._value;
  }

  static create(raw: string): TaskTitle {
    if (!raw) {
      throw new Error('Task title is required.');
    }

    const trimmed = raw.trim();

    if (trimmed.length < 3) {
      throw new Error('Task title must be at least 3 characters long.');
    }

    if (trimmed.length > 150) {
      throw new Error('Task title must be at most 150 characters long.');
    }

    return new TaskTitle(trimmed);
  }
}
