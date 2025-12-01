import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IIdGenerator } from '../../application/ports/id-generator.interface';

@Injectable()
export class UuidGenerator implements IIdGenerator {
  generate(): string {
    return uuidv4();
  }
}
