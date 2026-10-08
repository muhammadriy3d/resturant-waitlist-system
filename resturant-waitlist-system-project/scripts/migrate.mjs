import Database from "better-sqlite3";
import { readdirSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

// Load environment variables (.env.local, .env, etc.)
const projectDir = process.cwd();
loadEnvConfig(projectDir);

function getDatabasePath() {
  const configuredPath = process.env.DATABASE_PATH;
  if (configuredPath) {
    if (!isAbsolute(configuredPath)) {
      throw new Error("DATABASE_PATH must be an absolute path.");
    }
    return configuredPath;
  }
  return join(projectDir, "database", "data", "waitlist.sqlite");
}

function runMigrations() {
  const dbPath = getDatabasePath();
  mkdirSync(dirname(dbPath), { recursive: true });

  console.log(`Connecting to database: ${dbPath}`);
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("busy_timeout = 5000");
  db.pragma("foreign_keys = ON");

  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name TEXT PRIMARY KEY,
        applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const migrationDir = join(projectDir, "database", "migrations", "sqlite");
    if (!existsSync(migrationDir)) {
      console.log(`Migration directory not found: ${migrationDir}`);
      return;
    }

    const files = readdirSync(migrationDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    if (files.length === 0) {
      console.log("No migration files found.");
      return;
    }

    const hasMigration = db.prepare(
      "SELECT 1 FROM schema_migrations WHERE name = ?"
    );
    const recordMigration = db.prepare(
      "INSERT INTO schema_migrations (name) VALUES (?)"
    );

    let appliedCount = 0;
    let skippedCount = 0;

    for (const name of files) {
      if (hasMigration.get(name)) {
        skippedCount++;
        continue;
      }

      console.log(`Applying migration: ${name}...`);
      const sql = readFileSync(join(migrationDir, name), "utf8");

      const applyTx = db.transaction(() => {
        db.exec(sql);
        recordMigration.run(name);
      });
      applyTx.immediate();

      appliedCount++;
      console.log(`✓ Applied: ${name}`);
    }

    if (appliedCount === 0) {
      console.log(`Database is already up to date (${skippedCount} migration${skippedCount === 1 ? "" : "s"} previously applied).`);
    } else {
      console.log(`\nMigration completed: ${appliedCount} applied, ${skippedCount} previously applied.`);
    }
  } finally {
    db.close();
    console.log("Database connection closed.");
  }
}

try {
  runMigrations();
} catch (error) {
  console.error("Migration failed:", error);
  process.exit(1);
}
