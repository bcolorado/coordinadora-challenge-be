import { Router } from "express";
import authRoutes from "./auth.routes";
import locationRoutes from "./location.routes";
import quoteRoutes from "./quote.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/locations", locationRoutes);
router.use("/quotes", quoteRoutes);

export default router;
