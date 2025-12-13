import "dotenv/config";
import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import * as path from "path";

/**
 * TypeORM Data Source Configuration
 * Used for migrations and raw SQL queries
 */

const isProduction = process.env["NODE_ENV"] === "production";

const baseConfig: DataSourceOptions = {
  type: "mysql",
  host: process.env["DB_HOST"] || "localhost",
  port: parseInt(process.env["DB_PORT"] || "3306", 10),
  username: process.env["DB_USERNAME"] || "root",
  password: process.env["DB_PASSWORD"] || "root_password",
  database: process.env["DB_DATABASE"] || "challenge_coordinadora",
  synchronize: false,
  logging: !isProduction,
  migrations: [path.join(__dirname, "../persistence/migrations/*.{ts,js}")],
  entities: [],
};

export const AppDataSource = new DataSource(baseConfig);

/**
 * Initialize database connection
 */
export async function initializeDatabase(): Promise<DataSource> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log("Database connection established");
  }
  return AppDataSource;
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log("Database connection closed");
  }
}

/**
 * Execute raw SQL query
 * @param query SQL query string
 * @param parameters Query parameters
 * @returns Query result
 */
export async function executeQuery<T>(
  query: string,
  parameters?: unknown[]
): Promise<T> {
  return AppDataSource.query(query, parameters);
}
