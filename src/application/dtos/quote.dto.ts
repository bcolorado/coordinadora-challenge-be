/**
 * @swagger
 * components:
 *   schemas:
 *     QuoteRequest:
 *       type: object
 *       required:
 *         - weight
 *         - dimensions
 *         - originId
 *         - destinationId
 *       properties:
 *         weight:
 *           type: number
 *           example: 5.5
 *         dimensions:
 *           type: object
 *           properties:
 *             length:
 *               type: number
 *               example: 30
 *             width:
 *               type: number
 *               example: 20
 *             height:
 *               type: number
 *               example: 15
 *         originId:
 *           type: number
 *           example: 1
 *         destinationId:
 *           type: number
 *           example: 2
 */
export interface QuoteRequestDto {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  originId: number;
  destinationId: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     QuoteResponse:
 *       type: object
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
export interface QuoteResponseDto {
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
}
