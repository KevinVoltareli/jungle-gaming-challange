import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { IRealtimeNotifier } from "../../application/ports/realtime-notifier.interface";
export declare class RealtimeNotifierGateway implements OnGatewayConnection, OnGatewayDisconnect, IRealtimeNotifier {
    private readonly jwtService;
    private server;
    private readonly logger;
    constructor(jwtService: JwtService);
    private getUserRoom;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    notifyUser(userId: string, event: string, payload: any): Promise<void>;
    private extractToken;
}
