import { Router } from "express";
import { shipmentController } from "@adapters/di/container";

const router = Router();

/**
 * @swagger
 * /shipments:
 *   post:
 *     summary: Create a new shipment from quoted data
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateShipmentRequest'
 *     responses:
 *       201:
 *         description: Shipment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShipmentResponse'
 *       404:
 *         description: Origin or destination not found
 *       401:
 *         description: Unauthorized
 */
router.post("/", shipmentController.create.bind(shipmentController));

export default router;
