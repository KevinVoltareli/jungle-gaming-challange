import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { NotificationOrmEntity } from "./infrastructure/persistence/typeorm/entities/notification.orm-entity";
import { NotificationTypeOrmRepository } from "./infrastructure/persistence/typeorm/repositories/notification.typeorm-repository";

import { OnTaskCreatedHandler } from "./application/handlers/on-task-created.handler";
import { OnTaskUpdatedHandler } from "./application/handlers/on-task-updated.handler";
import { OnCommentCreatedHandler } from "./application/handlers/on-comment-created.handler";

import { RealtimeNotifierGateway } from "./infrastructure/websockets/realtime-notifier.gateway";
import { UUIDGenerator } from "./infrastructure/ids/uuid-generator.adapter";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_NAME || "challenge_db",
      entities: [NotificationOrmEntity],
      synchronize: true,
      logging: true,
    }),

    TypeOrmModule.forFeature([NotificationOrmEntity]),

    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || "super-secret-access",
      signOptions: { expiresIn: "15m" },
    }),
  ],
  controllers: [
    OnTaskCreatedHandler,
    OnTaskUpdatedHandler,
    OnCommentCreatedHandler,
  ],
  providers: [
    {
      provide: "INotificationRepository",
      useClass: NotificationTypeOrmRepository,
    },
    { provide: "IRealtimeNotifier", useClass: RealtimeNotifierGateway },
    { provide: "IIdGenerator", useClass: UUIDGenerator },
    RealtimeNotifierGateway,
  ],
})
export class AppModule {}
