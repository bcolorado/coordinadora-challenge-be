import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { initializeDatabase } from "@infrastructure/config/database.config";
import authRoutes from "@framework/routes/auth.routes";
import { errorMiddleware } from "@framework/middlewares/error.middleware";

const app = express();
const PORT = process.env["PORT"] || 4000;

//TODO integrate CORS middleware
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorMiddleware);

// Start server
async function bootstrap() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
