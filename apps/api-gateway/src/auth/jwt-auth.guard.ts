import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err: any, user: any, info: any, context: any) {
    // LOG DE DEBUG – NÃO É PRA PRODUÇÃO
    console.log("🛡 JwtAuthGuard.handleRequest", {
      err,
      user,
      info: info?.message || info,
    });

    return super.handleRequest(err, user, info, context);
  }
}
