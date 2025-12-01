import { Injectable } from "@nestjs/common";
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from "@nestjs/microservices";
import { IEventPublisher } from "../../application/ports/event-publisher.interface";

@Injectable()
export class RabbitEventPublisher implements IEventPublisher {
  private readonly client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL ?? "amqp://admin:admin@localhost:5672"],
        queue: process.env.RABBITMQ_TASKS_QUEUE ?? "tasks_events",
        queueOptions: { durable: true },
      },
    });
  }

  async publish(event: string, payload: any): Promise<void> {
    // 🚨 IMPORTANTE: emit (evento) e não send (RPC)
    this.client.emit(event, payload);
    console.log("📤 [RabbitEventPublisher] EMIT", event, payload);
  }
}
