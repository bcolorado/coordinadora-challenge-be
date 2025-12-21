import { Request, Response } from "express";
import { ValidationError } from "@shared/errors/app-error";
import { successResponse, errorResponse } from "@shared/types/api-response";
import { HandleErrors } from "@shared/errors/error-handler.decorator";
import { CreateShipmentUseCase } from "@application/use-cases/create-shipment.use-case";
import {
  GetUserShipmentsUseCase,
  UserShipmentDto,
} from "@application/use-cases/get-user-shipments.use-case";
import {
  GetShipmentStatusUseCase,
  ShipmentStatusDto,
} from "@application/use-cases/get-shipment-status.use-case";
import {
  createShipmentSchema,
  validate,
} from "../validators/shipment.validator";
import {
  CreateShipmentRequestDto,
  ShipmentResponseDto,
} from "@application/dtos/shipment.dto";

interface AuthenticatedRequest extends Request {
  user?: { userId: number; email: string };
}

export class ShipmentController {
  constructor(
    private readonly createShipmentUseCase: CreateShipmentUseCase,
    private readonly getUserShipmentsUseCase: GetUserShipmentsUseCase,
    private readonly getShipmentStatusUseCase: GetShipmentStatusUseCase
  ) {}

  @HandleErrors()
  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    const requestBodyValidation = validate(createShipmentSchema, req.body);
    if (!requestBodyValidation.success) {
      throw new ValidationError(
        "Validation failed",
        requestBodyValidation.errors.format()
      );
    }

    const input: CreateShipmentRequestDto = requestBodyValidation.data;
    const userId = req.user!.userId;
    const result: ShipmentResponseDto =
      await this.createShipmentUseCase.execute(input, userId);

    res.status(201).json(successResponse(result));
  }

  @HandleErrors()
  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const result: UserShipmentDto[] =
      await this.getUserShipmentsUseCase.execute(userId);
    res.status(200).json(successResponse(result));
  }

  @HandleErrors()
  async getStatus(req: Request, res: Response): Promise<void> {
    const trackingNumber: string = req.params["trackingNumber"]!;
    const result: ShipmentStatusDto | null =
      await this.getShipmentStatusUseCase.execute(trackingNumber);

    if (!result) {
      res.status(404).json(errorResponse("NOT_FOUND", "Envío no encontrado"));
      return;
    }

    res.status(200).json(successResponse(result));
  }
}
