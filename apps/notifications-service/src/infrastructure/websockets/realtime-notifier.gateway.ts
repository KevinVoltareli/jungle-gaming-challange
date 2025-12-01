import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Logger, UseGuards } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";

import { IRealtimeNotifier } from "../../application/ports/realtime-notifier.interface";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: "/notifications", // 👈 tem que bater com o frontend
})
export class RealtimeNotifierGateway
  implements OnGatewayConnection, OnGatewayDisconnect, IRealtimeNotifier
{
  private readonly logger = new Logger(RealtimeNotifierGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(private readonly jwtService: JwtService) {}

  /**
   * Conexão de um client WebSocket
   */
  async handleConnection(client: Socket) {
    try {
      // token vindo da query: ?token=xxx
      const token = client.handshake.query.token as string | undefined;

      if (!token) {
        this.logger.warn(
          `Conexão WS sem token. client.id=${client.id}, disconnect`
        );
        client.disconnect();
        return;
      }

      // valida JWT — MESMO SECRET do .env (JWT_ACCESS_SECRET)
      const payload: any = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET || "supersecretaccess",
      });

      const userId = payload.sub as string;

      if (!userId) {
        this.logger.warn(
          `Token sem sub (userId). client.id=${client.id}, disconnect`
        );
        client.disconnect();
        return;
      }

      // entra na sala do usuário
      client.join(userId);
      this.logger.log(
        `Cliente conectado no WS. client.id=${client.id}, userId=${userId}`
      );
    } catch (err) {
      this.logger.warn(
        `Token inválido no websocket, desconectando. client.id=${client.id} erro=${err}`
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado do WS. client.id=${client.id}`);
  }

  /**
   * Implementação do IRealtimeNotifier
   */
  async notifyUser(userId: string, event: string, payload: any): Promise<void> {
    // Só pra debug: ver se tem salas
    const adapter: any = (this.server as any)?.sockets?.adapter;
    const roomsCount = adapter?.rooms ? adapter.rooms.size : 0;

    if (!roomsCount) {
      this.logger.warn(
        "Adapter sem rooms — provavelmente sem conexões WS no momento"
      );
    } else {
      this.logger.log(
        `Adapter rooms: ${Array.from(adapter.rooms.keys()).join(", ")}`
      );
    }

    // Emite pro room do usuário
    this.server.to(userId).emit(event, payload);

    this.logger.log(
      `📡 Evento ${event} enviado via WS para userId=${userId} payload=${JSON.stringify(
        payload
      )}`
    );
  }
}
