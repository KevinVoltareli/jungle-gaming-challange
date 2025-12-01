import { IIdGenerator } from "../../application/ports/id-generator.interface";
export declare class UUIDGenerator implements IIdGenerator {
    generate(): string;
}
