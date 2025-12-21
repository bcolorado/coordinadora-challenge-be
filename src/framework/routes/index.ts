import { Router } from "express";
import authRoutes from "./auth.routes";
import locationRoutes from "./location.routes";
import quoteRoutes from "./quote.routes";
import shipmentRoutes from "./shipment.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/locations", locationRoutes);
router.use("/quotes", quoteRoutes);
router.use("/shipments", shipmentRoutes);

export default router;
