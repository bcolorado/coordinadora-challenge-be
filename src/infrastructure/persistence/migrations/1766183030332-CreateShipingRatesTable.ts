import { PoolConnection } from "mysql2/promise";

export async function up(connection: PoolConnection): Promise<void> {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS shipping_rates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      origin_location_id INT NOT NULL,
      destination_location_id INT NOT NULL,

      base_price_cents INT NOT NULL,
      price_per_kg_cents INT NOT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      CONSTRAINT fk_rates_origin
        FOREIGN KEY (origin_location_id) REFERENCES locations(id),
      CONSTRAINT fk_rates_destination
        FOREIGN KEY (destination_location_id) REFERENCES locations(id),

      UNIQUE KEY uq_rate_route (origin_location_id, destination_location_id),
      KEY idx_rate_route (origin_location_id, destination_location_id)
)
`);
}

export async function down(connection: PoolConnection): Promise<void> {
  await connection.query("DROP TABLE IF EXISTS shipping_rates");
}
