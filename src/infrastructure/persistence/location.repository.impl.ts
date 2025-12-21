import { ILocationRepository } from "@application/repositories/location.repository";
import { Location } from "@domain/entities/location.entity";
import { executeQuery } from "../config/database.config";
import { cache } from "../config/redis.config";

interface LocationRow {
  id: number;
  city_name: string;
  created_at: Date;
  updated_at: Date;
}

const CACHE_KEY_ALL = "locations:all";
const CACHE_TTL = 3600; // 1 hour

export class LocationRepository implements ILocationRepository {
  async findAll(): Promise<Location[]> {
    const cached = await cache.get<LocationRow[]>(CACHE_KEY_ALL);
    if (cached) {
      return cached.map(
        (row) =>
          new Location({
            id: row.id,
            cityName: row.city_name,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
          })
      );
    }

    const rows = await executeQuery<LocationRow[]>(
      "SELECT id, city_name, created_at, updated_at FROM locations ORDER BY city_name"
    );

    await cache.set(CACHE_KEY_ALL, rows, CACHE_TTL);

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
    if (id === undefined || id === null) {
      return null;
    }

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
