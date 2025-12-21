/**
 * @swagger
 * components:
 *   schemas:
 *     CreateShipmentRequest:
 *       type: object
 *       required:
 *         - origin
 *         - destination
 *         - actualWeight
 *         - volumetricWeight
 *         - chargeableWeight
 *         - rate
 *         - totalPriceCents
 *       properties:
 *         origin:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *             cityName:
 *               type: string
 *         destination:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *             cityName:
 *               type: string
 *         actualWeight:
 *           type: number
 *         volumetricWeight:
 *           type: number
 *         chargeableWeight:
 *           type: number
 *         rate:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *             basePriceCents:
 *               type: number
 *             pricePerKgCents:
 *               type: number
 *         totalPriceCents:
 *           type: number
 */
export interface CreateShipmentRequestDto {
  origin: {
    id: number;
    cityName: string;
  };
  destination: {
    id: number;
    cityName: string;
  };
  actualWeight: number;
  volumetricWeight: number;
  chargeableWeight: number;
  rate: {
    id: number;
    basePriceCents: number;
    pricePerKgCents: number;
  };
  totalPriceCents: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ShipmentResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         trackingNumber:
 *           type: string
 *         status:
 *           type: string
 *         origin:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *             cityName:
 *               type: string
 *         destination:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *             cityName:
 *               type: string
 *         quotedPriceCents:
 *           type: number
 *         createdAt:
 *           type: string
 */
export interface ShipmentResponseDto {
  id: number;
  trackingNumber: string;
  status: string;
  origin: {
    id: number;
    cityName: string;
  };
  destination: {
    id: number;
    cityName: string;
  };
  quotedPriceCents: number;
  createdAt: string;
}
