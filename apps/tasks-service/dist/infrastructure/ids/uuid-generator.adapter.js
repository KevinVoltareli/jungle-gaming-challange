"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UUIDGenerator = void 0;
const crypto_1 = require("crypto");
class UUIDGenerator {
    generate() {
        return (0, crypto_1.randomUUID)();
    }
}
exports.UUIDGenerator = UUIDGenerator;
//# sourceMappingURL=uuid-generator.adapter.js.map