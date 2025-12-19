import "dotenv/config";
import "reflect-metadata";
import { createApp } from "@framework/http/app";
import { initializeDatabase } from "@infrastructure/config/database.config";

const PORT = process.env["PORT"] || 4000;

async function bootstrap() {
  try {
    await initializeDatabase();

    const app = createApp();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
