import express, { Application } from "express";
import routes from "@framework/routes";
import { errorMiddleware } from "@framework/middlewares/error.middleware";

export function createApp(): Application {
  const app = express();

  // Middlewares
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api", routes);

  app.use(errorMiddleware);

  return app;
}
