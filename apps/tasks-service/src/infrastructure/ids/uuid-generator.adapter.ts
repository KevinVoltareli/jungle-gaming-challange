import { randomUUID } from "crypto";
import { IIdGenerator } from "../../application/ports/id-generator.interface";

export class UUIDGenerator implements IIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
