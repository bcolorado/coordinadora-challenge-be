import { Router } from "express";
import authRoutes from "./auth.routes";
import locationRoutes from "./location.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/locations", locationRoutes);

export default router;
