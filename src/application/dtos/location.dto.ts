/**
 * @swagger
 * components:
 *   schemas:
 *     LocationResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         cityName:
 *           type: string
 *           example: "Bogotá"
 */
export interface LocationResponseDto {
  id: number;
  cityName: string;
}
