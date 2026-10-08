import type Database from "better-sqlite3";
import { hashPassword } from "@/app/staff/_lib/password";
import type { RepositoryBundle } from "@/database/contracts";
import { openSqliteDatabase } from "@/database/sqlite/connection";
import { applySqliteMigrations } from "@/database/sqlite/migrate";
import { createSqliteRepositories } from "@/database/sqlite/repositories";

declare global {
  var waitlistRepositories: RepositoryBundle | undefined;
  var waitlistSqliteConnection: Database.Database | undefined;
}

function createRepositories(): RepositoryBundle {
  const driver = process.env.DATABASE_DRIVER ?? "sqlite";
  if (driver !== "sqlite") {
    throw new Error(`Unsupported DATABASE_DRIVER: ${driver}`);
  }

  const connection = openSqliteDatabase();
  applySqliteMigrations(connection);
  const repositories = createSqliteRepositories(connection);
  configureStaffAccount(repositories);

  globalThis.waitlistSqliteConnection = connection;
  return repositories;
}

function configureStaffAccount(repositories: RepositoryBundle): void {
  const configuredUsername = process.env.STAFF_USERNAME;
  const configuredPassword = process.env.STAFF_PASSWORD;
  if (!configuredUsername && !configuredPassword) {
    return;
  }
  if (!configuredUsername || !configuredPassword) {
    throw new Error(
      "Set both STAFF_USERNAME and STAFF_PASSWORD to configure staff login.",
    );
  }

  const username = configuredUsername.trim().toLowerCase();
  const name = process.env.STAFF_NAME?.trim() || username;
  if (!username || username.length > 80 || configuredPassword.length < 6) {
    throw new Error(
      "STAFF_USERNAME must be 1-80 characters and STAFF_PASSWORD must be at least 6 characters.",
    );
  }

  const existingRole = repositories.users.findRoleByUsername(username);
  if (existingRole) {
    if (existingRole !== "staff") {
      throw new Error(
        "The configured STAFF_USERNAME is already assigned to a customer.",
      );
    }
    return;
  }

  repositories.users.createStaff({
    name,
    username,
    passwordHash: hashPassword(configuredPassword),
  });
}

export const repositories =
  globalThis.waitlistRepositories ?? createRepositories();

if (!globalThis.waitlistRepositories) {
  globalThis.waitlistRepositories = repositories;
}
