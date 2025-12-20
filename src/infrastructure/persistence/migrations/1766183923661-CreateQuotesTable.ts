import { PoolConnection } from "mysql2/promise";

export async function up(connection: PoolConnection): Promise<void> {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS quotes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      origin_location_id INT NOT NULL,
      destination_location_id INT NOT NULL,

      -- input del paquete
      actual_weight_kg DECIMAL(10,3) NOT NULL,
      length_cm INT NOT NULL,
      width_cm INT NOT NULL,
      height_cm INT NOT NULL,

      -- cálculo guardado
      volumetric_weight_kg INT NOT NULL,   -- CEIL((L*W*H)/2500)
      chargeable_weight_kg INT NOT NULL,   -- MAX(CEIL(actual_weight_kg), volumetric_weight_kg)

      -- tarifa aplicada
      shipping_rate_id INT NOT NULL,

      -- resultado final
      quoted_price_cents INT NOT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      CONSTRAINT fk_quotes_user
        FOREIGN KEY (user_id) REFERENCES users(id),
      CONSTRAINT fk_quotes_origin
        FOREIGN KEY (origin_location_id) REFERENCES locations(id),
      CONSTRAINT fk_quotes_destination
        FOREIGN KEY (destination_location_id) REFERENCES locations(id),
      CONSTRAINT fk_quotes_rate
        FOREIGN KEY (shipping_rate_id) REFERENCES shipping_rates(id),

      KEY idx_quotes_user_created (user_id, created_at),
      KEY idx_quotes_route (origin_location_id, destination_location_id)
    )
  `);
}

export async function down(connection: PoolConnection): Promise<void> {
  await connection.query("DROP TABLE IF EXISTS quotes");
}
