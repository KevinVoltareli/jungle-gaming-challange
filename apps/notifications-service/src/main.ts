import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? "amqp://admin:admin@localhost:5672"],
      queue: "tasks_events",
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();
  console.log("✔ Notifications-Service pronto e ouvindo eventos! 🔔");

  //  HTTP + WebSocket na mesma app
  const port = Number(process.env.PORT) || 3005;
  await app.listen(port);
  console.log(`🚀 Notifications-Service WebSocket ativo na porta ${port}`);
}

bootstrap();
