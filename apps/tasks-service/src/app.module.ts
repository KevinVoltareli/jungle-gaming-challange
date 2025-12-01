import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TasksModule } from "./tasks.module";

import { TaskOrmEntity } from "./infrastructure/persistence/typeorm/entities/task.orm-entity";
import { CommentOrmEntity } from "./infrastructure/persistence/typeorm/entities/comment.orm-entity";
import { TaskAssigneeOrmEntity } from "./infrastructure/persistence/typeorm/entities/task-assignee.orm-entity";
import { TaskHistoryOrmEntity } from "./infrastructure/persistence/typeorm/entities/task-history.orm-entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_NAME || "challenge_db",

      entities: [
        TaskOrmEntity,
        CommentOrmEntity,
        TaskAssigneeOrmEntity,
        TaskHistoryOrmEntity,
      ],

      synchronize: true,
      logging: true,
    }),

    TasksModule,
  ],
})
export class AppModule {}
