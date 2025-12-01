"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UUIDGenerator = void 0;
const uuid_1 = require("uuid");
class UUIDGenerator {
    generate() {
        return (0, uuid_1.v4)();
    }
}
exports.UUIDGenerator = UUIDGenerator;
//# sourceMappingURL=uuid-generator.adapter.js.map