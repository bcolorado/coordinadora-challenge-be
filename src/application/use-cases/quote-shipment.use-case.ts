import { ShippingRate } from "@domain/entities/shipping-rate.entity";
import {
  ShippingCalculationResult,
  ShippingCalculator,
} from "@domain/services/shipping-calculator.service";
import { ILocationRepository } from "../repositories/location.repository";
import { IShippingRateRepository } from "../repositories/shipping-rate.repository";
import { QuoteRequestDto, QuoteResponseDto } from "@application/dtos/quote.dto";
import { AppError } from "@shared/errors/app-error";
import { Location } from "@domain/entities/location.entity";

export class QuoteShipmentUseCase {
  constructor(
    private readonly locationRepository: ILocationRepository,
    private readonly shippingRateRepository: IShippingRateRepository
  ) {}

  async execute(input: QuoteRequestDto): Promise<QuoteResponseDto> {
    const origin: Location | null = await this.locationRepository.findById(
      input.originId
    );
    if (!origin) {
      throw new AppError("Origen no encontrado", 404, "ORIGIN_NOT_FOUND");
    }

    const destination: Location | null = await this.locationRepository.findById(
      input.destinationId
    );
    if (!destination) {
      throw new AppError("Destino no encontrado", 404, "DESTINATION_NOT_FOUND");
    }

    const rate: ShippingRate | null =
      await this.shippingRateRepository.findByRoute(
        input.originId,
        input.destinationId
      );
    if (!rate) {
      throw new AppError(
        "No hay tarifa disponible para esta ruta",
        404,
        "RATE_NOT_FOUND"
      );
    }

    const calculation: ShippingCalculationResult = ShippingCalculator.calculate(
      input.weight,
      input.dimensions,
      rate
    );

    return {
      origin: {
        id: origin.id!,
        cityName: origin.cityName,
      },
      destination: {
        id: destination.id!,
        cityName: destination.cityName,
      },
      actualWeight: calculation.actualWeight,
      volumetricWeight: calculation.volumetricWeight,
      chargeableWeight: calculation.chargeableWeight,
      rate: {
        id: rate.id!,
        basePriceCents: rate.basePriceCents,
        pricePerKgCents: rate.pricePerKgCents,
      },
      totalPriceCents: calculation.totalPriceCents,
    };
  }
}
