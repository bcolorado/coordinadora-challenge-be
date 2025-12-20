import { Location } from "@domain/entities/location.entity";

export interface ILocationRepository {
  findAll(): Promise<Location[]>;
  findById(id: number): Promise<Location | null>;
}
