import { ILocationRepository } from "@application/repositories/location.repository";
import { Location } from "@domain/entities/location.entity";

export class MockLocationRepository implements ILocationRepository {
  private locations: Location[] = [];

  async findAll(): Promise<Location[]> {
    return this.locations;
  }

  async findById(id: number): Promise<Location | null> {
    return this.locations.find((l) => l.id === id) || null;
  }

  clear(): void {
    this.locations = [];
  }

  seed(locations: Location[]): void {
    this.locations = [...locations];
  }
}
