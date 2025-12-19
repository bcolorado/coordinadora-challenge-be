import { PoolConnection } from "mysql2/promise";

export async function up(connection: PoolConnection): Promise<void> {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      fullName VARCHAR(255) NOT NULL,
      document VARCHAR(20) NOT NULL UNIQUE,
      documentType VARCHAR(10) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}

export async function down(connection: PoolConnection): Promise<void> {
  await connection.query(`DROP TABLE IF EXISTS users`);
}
