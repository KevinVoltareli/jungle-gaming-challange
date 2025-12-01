"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitEventPublisher = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
let RabbitEventPublisher = class RabbitEventPublisher {
    constructor() {
        this.client = microservices_1.ClientProxyFactory.create({
            transport: microservices_1.Transport.RMQ,
            options: {
                urls: [process.env.RABBITMQ_URL ?? "amqp://admin:admin@localhost:5672"],
                queue: process.env.RABBITMQ_TASKS_QUEUE ?? "tasks_events",
                queueOptions: { durable: true },
            },
        });
    }
    async publish(event, payload) {
        // 🚨 IMPORTANTE: emit (evento) e não send (RPC)
        this.client.emit(event, payload);
        console.log("📤 [RabbitEventPublisher] EMIT", event, payload);
    }
};
exports.RabbitEventPublisher = RabbitEventPublisher;
exports.RabbitEventPublisher = RabbitEventPublisher = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RabbitEventPublisher);
//# sourceMappingURL=rabbit-event-publisher.js.map