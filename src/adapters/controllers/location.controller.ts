import { Request, Response } from "express";
import { GetLocationsUseCase } from "@application/use-cases/get-locations.use-case";
import { successResponse } from "@shared/types/api-response";
import { HandleErrors } from "@shared/errors/error-handler.decorator";

export class LocationController {
  constructor(private readonly getLocationsUseCase: GetLocationsUseCase) {}

  @HandleErrors()
  async getAll(_req: Request, res: Response): Promise<void> {
    const locations = await this.getLocationsUseCase.execute();
    res.status(200).json(successResponse(locations));
  }
}
