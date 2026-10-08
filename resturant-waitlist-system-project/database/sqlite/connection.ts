import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";

function migrateLegacyDatabase(filename: string, legacyFilename: string): void {
  if (existsSync(filename) || !existsSync(legacyFilename)) {
    return;
  }

  const legacyDatabase = new Database(legacyFilename, { readonly: true });
  try {
    const escapedFilename = filename.replace(/'/g, "''");
    legacyDatabase.exec(`VACUUM INTO '${escapedFilename}'`);
  } finally {
    legacyDatabase.close();
  }
}

export function openSqliteDatabase(): Database.Database {
  const configuredPath = process.env.DATABASE_PATH;
  if (configuredPath && !isAbsolute(configuredPath)) {
    throw new Error("DATABASE_PATH must be an absolute path.");
  }

  const databaseDirectory = join(process.cwd(), "database");
  const filename =
    configuredPath ?? join(databaseDirectory, "data", "waitlist.sqlite");
  mkdirSync(dirname(filename), { recursive: true });

  if (!configuredPath) {
    migrateLegacyDatabase(
      filename,
      join(process.cwd(), "data", "waitlist.sqlite"),
    );
  }

  const database = new Database(filename);
  database.pragma("journal_mode = WAL");
  database.pragma("busy_timeout = 5000");
  database.pragma("foreign_keys = ON");
  return database;
}
