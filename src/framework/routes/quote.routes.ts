import { Router } from "express";
import { quoteController } from "@adapters/di/container";

const router = Router();

/**
 * @swagger
 * /quotes:
 *   post:
 *     summary: Quote shipment price
 *     tags: [Quotes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuoteRequest'
 *     responses:
 *       200:
 *         description: Quote calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuoteResponse'
 *       404:
 *         description: Origin, destination or rate not found
 *       401:
 *         description: Unauthorized
 */
router.post("/", quoteController.quote.bind(quoteController));

export default router;
