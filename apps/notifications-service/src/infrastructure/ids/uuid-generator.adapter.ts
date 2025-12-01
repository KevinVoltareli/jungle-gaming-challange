import { v4 as uuidv4 } from "uuid";
import { IIdGenerator } from "../../application/ports/id-generator.interface";

export class UUIDGenerator implements IIdGenerator {
  generate(): string {
    return uuidv4();
  }
}
