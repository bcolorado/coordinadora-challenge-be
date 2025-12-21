import { Router } from "express";
import { shipmentController } from "@adapters/di/container";

const router = Router();

/**
 * @swagger
 * /shipments:
 *   get:
 *     summary: Get all shipments for the authenticated user
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user shipments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       trackingNumber:
 *                         type: string
 *                       status:
 *                         type: string
 *                       chargeableWeightKg:
 *                         type: number
 *                       quotedPriceCents:
 *                         type: number
 *                       createdAt:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/", shipmentController.getAll.bind(shipmentController));

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

/**
 * @swagger
 * /shipments/{trackingNumber}/status:
 *   get:
 *     summary: Get shipment status and history by tracking number
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trackingNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shipment status with history
 *       404:
 *         description: Shipment not found
 */
router.get(
  "/:trackingNumber/status",
  shipmentController.getStatus.bind(shipmentController)
);

export default router;
