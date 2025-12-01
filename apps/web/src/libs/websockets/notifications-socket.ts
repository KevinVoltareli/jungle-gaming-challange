// apps/web/src/libs/websockets/notifications-socket.ts
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../store/auth.store";

let socket: Socket | null = null;

export function getNotificationsSocket(): Socket {
  if (!socket) {
    const url = "http://localhost:3005/notifications";

    const token = useAuthStore.getState().tokens?.accessToken ?? "";

    socket = io(url, {
      transports: ["websocket"],
      query: token ? { token } : {},
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("[WS] WebSocket conectado:", socket!.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("[WS] WebSocket desconectado:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("[WS] Erro na conexão WebSocket:", err);
    });
  }

  return socket;
}
