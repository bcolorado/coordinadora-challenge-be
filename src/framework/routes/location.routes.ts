import { Router } from "express";
import { locationController } from "@adapters/di/container";

const router = Router();

/**
 * @swagger
 * /locations:
 *   get:
 *     summary: Get all locations
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: List of locations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LocationResponse'
 */
router.get("/", locationController.getAll.bind(locationController));

export default router;
