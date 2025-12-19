import { pool } from "../config/database.config";
import * as fs from "fs";
import * as path from "path";

const MIGRATIONS_DIR = path.join(__dirname, "migrations");

interface MigrationEntry {
  id: number;
  name: string;
  timestamp: Date;
}

// Extract timestamp from migration name
function getTimestamp(name: string | undefined): string | null {
  const match = name?.match(/(\d+)/);
  return match ? match[0] : null;
}

async function ensureMigrationsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.execute(query);
}

async function getAppliedMigrations(): Promise<string[]> {
  const [rows] = await pool.execute("SELECT name FROM migrations");
  return (rows as MigrationEntry[]).map((row) => row.name);
}

async function runUp() {
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".ts") || f.endsWith(".js"))
    .sort();

  const appliedTimestamps = new Set(applied.map(getTimestamp).filter(Boolean));

  for (const file of files) {
    const fileTimestamp = getTimestamp(file);

    // Skip if this timestamp is already in the DB
    if (fileTimestamp && appliedTimestamps.has(fileTimestamp)) {
      continue;
    }
    // Also skip if exact name match (fallback)
    if (applied.includes(file)) {
      continue;
    }

    console.log(`Running migration: ${file}`);
    const migration = require(path.join(MIGRATIONS_DIR, file));
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      await migration.up(connection);
      await connection.execute(
        "INSERT INTO migrations (name, timestamp) VALUES (?, ?)",
        [file, new Date()]
      );
      await connection.commit();
      console.log(`Migration ${file} completed.`);
    } catch (error) {
      await connection.rollback();
      console.error(`Migration ${file} failed:`, error);
      process.exit(1);
    } finally {
      connection.release();
    }
  }
  console.log("All migrations are up to date.");
}

async function runDown() {
  const applied = await getAppliedMigrations();
  if (applied.length === 0) {
    console.log("No migrations to revert.");
    process.exit(0);
  }

  const lastMigrationName = applied[applied.length - 1];
  const lastTimestamp = getTimestamp(lastMigrationName);

  if (!lastTimestamp) {
    throw new Error(
      `Could not parse timestamp from migration entry: ${lastMigrationName}`
    );
  }

  const files = fs.readdirSync(MIGRATIONS_DIR);
  const migrationFile = files.find((f) => getTimestamp(f) === lastTimestamp);

  if (!migrationFile) {
    throw new Error(
      `Could not find file for migration: ${lastMigrationName} (Timestamp: ${lastTimestamp})`
    );
  }

  console.log(
    `Reverting migration: ${migrationFile} (DB: ${lastMigrationName})`
  );

  const migration = require(path.join(MIGRATIONS_DIR, migrationFile));
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await migration.down(connection);
    await connection.execute("DELETE FROM migrations WHERE name = ?", [
      lastMigrationName,
    ]);
    await connection.commit();
    console.log(`Migration ${migrationFile} reverted.`);
  } catch (error) {
    await connection.rollback();
    console.error(`Revert of ${migrationFile} failed:`, error);
    process.exit(1);
  } finally {
    connection.release();
  }
}

async function createMigration(name: string | undefined) {
  if (!name) {
    console.error("Please provide a migration name.");
    process.exit(1);
  }
  const timestamp = new Date().getTime();
  const filename = `${timestamp}-${name}.ts`;
  const template = `import { PoolConnection } from "mysql2/promise";\n\nexport async function up(connection: PoolConnection): Promise<void> {\n  // await connection.query("...");\n}\n\nexport async function down(connection: PoolConnection): Promise<void> {\n  // await connection.query("...");\n}\n`;

  fs.writeFileSync(path.join(MIGRATIONS_DIR, filename), template);
  console.log(`Created migration: ${filename}`);
}

async function main() {
  const command = process.argv[2];
  const name = process.argv[3];

  try {
    switch (command) {
      case "up":
        await runUp();
        break;
      case "down":
        await runDown();
        break;
      case "create":
        await createMigration(name);
        break;
      default:
        console.log("Usage: migrator.ts [up|down|create <name>]");
    }
  } catch (error) {
    console.error("Migrator error:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
