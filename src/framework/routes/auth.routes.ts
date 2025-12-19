import { Router } from "express";
import { authController } from "@adapters/di/container";

const router = Router();

router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));

export default router;
