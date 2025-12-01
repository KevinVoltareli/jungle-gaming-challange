"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RealtimeNotifierGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeNotifierGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
let RealtimeNotifierGateway = RealtimeNotifierGateway_1 = class RealtimeNotifierGateway {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(RealtimeNotifierGateway_1.name);
    }
    getUserRoom(userId) {
        return `user:${userId}`;
    }
    async handleConnection(client) {
        try {
            const token = this.extractToken(client);
            if (!token) {
                throw new common_1.UnauthorizedException("Missing auth token");
            }
            const secret = process.env.JWT_ACCESS_SECRET || "changeme";
            const payload = this.jwtService.verify(token, {
                secret,
            });
            const userId = payload.sub;
            if (!userId) {
                throw new common_1.UnauthorizedException("Invalid token payload (no sub)");
            }
            client.data.userId = userId;
            const room = this.getUserRoom(userId);
            client.join(room);
            this.logger.debug(`Client conectado: socketId=${client.id}, userId=${userId}, room=${room}`);
            client.emit("ws:connected", { userId });
        }
        catch (err) {
            this.logger.warn(`Conexão WS rejeitada (socketId=${client.id}): ${err.message}`);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const userId = client.data.userId;
        this.logger.debug(`Client desconectado: socketId=${client.id}, userId=${userId}`);
    }
    async notifyUser(userId, event, payload) {
        const room = this.getUserRoom(userId);
        this.server.to(room).emit(event, payload);
    }
    extractToken(client) {
        var _a;
        const authToken = (_a = client.handshake.auth) === null || _a === void 0 ? void 0 : _a.token;
        if (authToken)
            return authToken;
        const authHeader = client.handshake.headers["authorization"] ||
            client.handshake.headers["Authorization"];
        if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
            return authHeader.substring("Bearer ".length);
        }
        const queryToken = client.handshake.query["token"];
        if (typeof queryToken === "string") {
            return queryToken;
        }
        return null;
    }
};
exports.RealtimeNotifierGateway = RealtimeNotifierGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RealtimeNotifierGateway.prototype, "server", void 0);
exports.RealtimeNotifierGateway = RealtimeNotifierGateway = RealtimeNotifierGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: "*",
        },
    }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], RealtimeNotifierGateway);
//# sourceMappingURL=realtime-notifier.gateway.js.map