import express, { Request, Response } from "express";

const app = express();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!!!!!");
});
