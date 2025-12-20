import { ILocationRepository } from "@application/repositories/location.repository";
import { Location } from "@domain/entities/location.entity";
import { executeQuery } from "../config/database.config";

interface LocationRow {
  id: number;
  city_name: string;
  created_at: Date;
  updated_at: Date;
}

export class LocationRepository implements ILocationRepository {
  async findAll(): Promise<Location[]> {
    const rows = await executeQuery<LocationRow[]>(
      "SELECT id, city_name, created_at, updated_at FROM locations ORDER BY city_name"
    );

    return rows.map(
      (row) =>
        new Location({
          id: row.id,
          cityName: row.city_name,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        })
    );
  }

  async findById(id: number): Promise<Location | null> {
    const rows = await executeQuery<LocationRow[]>(
      "SELECT id, city_name, created_at, updated_at FROM locations WHERE id = ?",
      [id]
    );

    if (rows.length === 0) return null;

    const row = rows[0]!;
    return new Location({
      id: row.id,
      cityName: row.city_name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
