import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthUser } from "./auth-user.type";

interface JwtPayload {
  sub: string; // ID do usuário
  email?: string;
  username?: string;
  roles?: string[];
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor() {
    const secret = process.env.JWT_ACCESS_SECRET || "supersecretaccess";
    console.log("🚩 JWT_ACCESS_SECRET no API Gateway =", secret);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // ⚠️ tem que bater com o JWT_ACCESS_SECRET do auth-service
      secretOrKey: process.env.JWT_ACCESS_SECRET || "supersecretaccess",
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    // o que você retornar aqui vira `req.user`
    return {
      userId: payload.sub,
      email: payload.email,
      username: payload.username,
      roles: payload.roles ?? [],
    };
  }
}
