import { Request, Response } from "express";
import { QuoteShipmentUseCase } from "@application/use-cases/quote-shipment.use-case";
import { successResponse } from "@shared/types/api-response";
import { HandleErrors } from "@shared/errors/error-handler.decorator";
import { QuoteRequestDto } from "@application/dtos/quote.dto";

export class QuoteController {
  constructor(private readonly quoteShipmentUseCase: QuoteShipmentUseCase) {}

  @HandleErrors()
  async quote(req: Request, res: Response): Promise<void> {
    const input: QuoteRequestDto = req.body;
    const result = await this.quoteShipmentUseCase.execute(input);
    res.status(200).json(successResponse(result));
  }
}
