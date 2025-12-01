import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { HttpModule } from "@nestjs/axios";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || "changeme",
      signOptions: {
        // gateway normalmente só verifica, quem assina é o auth-service,
        // mas deixamos configurado por consistência
        expiresIn: "15m",
      },
    }),
    HttpModule,
  ],
  providers: [JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [PassportModule, JwtModule, JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
