import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || "amqp://admin:admin@localhost:5672"],
        queue: process.env.RABBITMQ_NOTIFICATIONS_QUEUE || "tasks_events",
        queueOptions: {
          durable: true,
        },
      },
    }
  );

  await app.listen();
  console.log("📡 Notifications Microservice conectado ao RabbitMQ!");
}

bootstrap();
