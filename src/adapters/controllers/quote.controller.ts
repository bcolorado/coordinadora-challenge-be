import { Request, Response } from "express";
import { ValidationError } from "@shared/errors/app-error";
import { successResponse } from "@shared/types/api-response";
import { HandleErrors } from "@shared/errors/error-handler.decorator";
import { QuoteShipmentUseCase } from "@application/use-cases/quote-shipment.use-case";
import { quoteSchema, validate } from "../validators/shipment.validator";
import { QuoteRequestDto, QuoteResponseDto } from "@application/dtos/quote.dto";

export class QuoteController {
  constructor(private readonly quoteShipmentUseCase: QuoteShipmentUseCase) {}

  @HandleErrors()
  async quote(req: Request, res: Response): Promise<void> {
    const requestBodyValidation = validate(quoteSchema, req.body);
    if (!requestBodyValidation.success) {
      throw new ValidationError(
        "Validation failed",
        requestBodyValidation.errors.format()
      );
    }

    const input: QuoteRequestDto = requestBodyValidation.data;
    const result: QuoteResponseDto = await this.quoteShipmentUseCase.execute(
      input
    );

    res.status(200).json(successResponse(result));
  }
}
