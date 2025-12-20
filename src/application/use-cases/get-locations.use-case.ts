import { ILocationRepository } from "../repositories/location.repository";
import { LocationResponseDto } from "@application/dtos/location.dto";

export class GetLocationsUseCase {
  constructor(private readonly locationRepository: ILocationRepository) {}

  async execute(): Promise<LocationResponseDto[]> {
    const locations = await this.locationRepository.findAll();

    return locations.map((location) => ({
      id: location.id!,
      cityName: location.cityName,
    }));
  }
}
