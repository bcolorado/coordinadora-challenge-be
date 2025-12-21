import "dotenv/config";
import "reflect-metadata";
import { createServer } from "http";
import { createApp } from "@framework/http/app";
import { initializeDatabase } from "@infrastructure/config/database.config";
import { socketService } from "@infrastructure/services/socket.service";
import { setupWebSocket } from "@framework/websocket/websocket.setup";

const PORT = process.env["PORT"] || 4000;

async function bootstrap() {
  try {
    await initializeDatabase();

    const app = createApp();
    const httpServer = createServer(app);

    const io = socketService.initialize(httpServer);
    setupWebSocket(io);

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`WebSocket ready`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
