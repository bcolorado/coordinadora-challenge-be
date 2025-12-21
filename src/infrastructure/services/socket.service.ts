import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

interface AuthSocket extends Socket {
  userId?: number;
}

class SocketService {
  private io: Server | null = null;
  private static instance: SocketService;

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  initialize(httpServer: HttpServer): Server {
    this.io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.io.use((socket: AuthSocket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication required"));
      }

      try {
        const secret = process.env["JWT_SECRET"] || "dev-secret";
        const decoded = jwt.verify(token, secret) as { userId: number };
        socket.userId = decoded.userId;
        next();
      } catch {
        next(new Error("Invalid token"));
      }
    });

    this.io.on("connection", (socket: AuthSocket) => {
      console.log(`Client connected: ${socket.id}, userId: ${socket.userId}`);

      socket.on("join_shipment", ({ shipmentId }) => {
        socket.join(`shipment:${shipmentId}`);
        console.log(`Socket ${socket.id} joined shipment:${shipmentId}`);
      });

      socket.on("leave_shipment", ({ shipmentId }) => {
        socket.leave(`shipment:${shipmentId}`);
        console.log(`Socket ${socket.id} left shipment:${shipmentId}`);
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });

    return this.io;
  }

  getIO(): Server | null {
    return this.io;
  }

  emitStatusUpdate(
    shipmentId: number,
    data: { status: string; occurredAt: string; note: string | null }
  ): void {
    if (this.io) {
      this.io.to(`shipment:${shipmentId}`).emit("status_updated", {
        shipmentId,
        ...data,
      });
    }
  }
}

export const socketService = SocketService.getInstance();
