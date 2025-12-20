import { PoolConnection } from "mysql2/promise";

export async function up(connection: PoolConnection): Promise<void> {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      hashed_password VARCHAR(255) NOT NULL,
      first_name VARCHAR(255) NOT NULL,
      second_name VARCHAR(255) NULL,
      first_surname VARCHAR(255) NOT NULL,
      second_surname VARCHAR(255) NULL,
      document VARCHAR(20) NOT NULL UNIQUE,
      document_type VARCHAR(10) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}

export async function down(connection: PoolConnection): Promise<void> {
  await connection.query(`DROP TABLE IF EXISTS users`);
}
