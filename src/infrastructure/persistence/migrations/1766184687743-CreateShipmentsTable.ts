import { PoolConnection } from "mysql2/promise";

export async function up(connection: PoolConnection): Promise<void> {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS shipments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      quote_id INT NOT NULL,

      tracking_number VARCHAR(40) NOT NULL,
      current_status ENUM('EN_ESPERA', 'EN_TRANSITO', 'ENTREGADO') NOT NULL DEFAULT 'EN_ESPERA',

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      CONSTRAINT fk_shipments_user
        FOREIGN KEY (user_id) REFERENCES users(id),
      CONSTRAINT fk_shipments_quote
        FOREIGN KEY (quote_id) REFERENCES quotes(id),

      UNIQUE KEY uq_shipments_tracking (tracking_number),
      UNIQUE KEY uq_shipments_quote (quote_id),

      KEY idx_shipments_user_created (user_id, created_at),
      KEY idx_shipments_status (current_status)
    )
    `);
}

export async function down(connection: PoolConnection): Promise<void> {
  await connection.query("DROP TABLE IF EXISTS shipments");
}
