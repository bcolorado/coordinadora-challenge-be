import { PoolConnection } from "mysql2/promise";

export async function up(connection: PoolConnection): Promise<void> {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS shipment_status_events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      shipment_id INT NOT NULL,
      status ENUM('EN_ESPERA', 'EN_TRANSITO', 'ENTREGADO') NOT NULL,
      occurred_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      note VARCHAR(255) NULL,

      CONSTRAINT fk_events_shipment
        FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,

      KEY idx_events_shipment_time (shipment_id, occurred_at)
    )
  `);
}

export async function down(connection: PoolConnection): Promise<void> {
  await connection.query("DROP TABLE IF EXISTS shipment_status_events");
}
