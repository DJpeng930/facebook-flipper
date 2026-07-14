import { app } from "electron";
import Database from "better-sqlite3";
import { join } from "path";
import { mkdirSync } from "fs";
import { SCHEMA_VERSION, schemaStatements } from "./schema";

let database: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!database) {
    const databaseDir = join(app.getPath("userData"), "data");
    mkdirSync(databaseDir, { recursive: true });

    database = new Database(join(databaseDir, "facebook-flipper.sqlite"));
    database.pragma("journal_mode = WAL");
    database.pragma("foreign_keys = ON");
    migrate(database);
  }

  return database;
}

function migrate(db: Database.Database): void {
  const currentVersion = db.pragma("user_version", { simple: true }) as number;

  if (currentVersion < 1) {
    const migration = db.transaction(() => {
      schemaStatements.forEach((statement) => db.exec(statement));
      db.pragma(`user_version = ${SCHEMA_VERSION}`);
    });

    migration();
    return;
  }

  schemaStatements.forEach((statement) => db.exec(statement));
}
