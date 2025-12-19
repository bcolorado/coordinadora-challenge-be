import mysql from "mysql2/promise";
import "dotenv/config";

const config = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  user: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "root_password",
  database: process.env.DB_DATABASE || "challenge_coordinadora",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

export const pool = mysql.createPool(config);

export async function executeQuery<T>(
  query: string,
  parameters?: unknown[]
): Promise<T> {
  const [rows] = await pool.execute(query, parameters);
  return rows as T;
}

export async function getConnection(): Promise<mysql.PoolConnection> {
  return await pool.getConnection();
}

export async function initializeDatabase(): Promise<void> {
  try {
    const connection = await pool.getConnection();
    console.log("Database connection established successfully (mysql2)");
    connection.release();
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
}
