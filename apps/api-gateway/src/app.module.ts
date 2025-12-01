import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { TasksModule } from "./tasks/tasks.module";

@Module({
  imports: [
    AuthModule,
    TasksModule,
    // depois dá pra adicionar NotificationsModule etc.
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
