export type RawNotificationPayload = Record<string, any>;

export class NotificationPayload {
  private constructor(private readonly _value: RawNotificationPayload) {}

  static create(value: RawNotificationPayload): NotificationPayload {
    // aqui dá pra validar tamanho, campos obrigatórios, etc, se quiser
    return new NotificationPayload({ ...value });
  }

  // usado pra rehidratar do banco
  static fromPlain(value: RawNotificationPayload): NotificationPayload {
    return new NotificationPayload({ ...value });
  }

  get value(): RawNotificationPayload {
    // devolve cópia pra não mutar internamente
    return { ...this._value };
  }

  toJSON(): RawNotificationPayload {
    return this.value;
  }
}
