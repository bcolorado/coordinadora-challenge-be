import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1702490575000 implements MigrationInterface {
  name = "CreateUsersTable1702490575000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        document VARCHAR(50) NOT NULL,
        document_type VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        hashed_password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        second_name VARCHAR(100) NULL,
        first_surname VARCHAR(100) NOT NULL,
        second_surname VARCHAR(100) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uk_users_document (document, document_type),
        UNIQUE KEY uk_users_email (email),
        INDEX idx_users_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
  }
}
