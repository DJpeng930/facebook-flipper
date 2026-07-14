import Store from "electron-store";
import { AppSettings } from "../../../shared/types";
import { getDatabase } from "../database/database";

export class SettingsRepository {
  private static secretStore = new Store<AppSettings>({
    name: "settings",
    encryptionKey: "d",
    defaults: {
      apiKey: "",
      location: null
    }
  });

  static getApiKey(): string {
    return this.secretStore.get("apiKey");
  }

  static setApiKey(apiKey: string): void {
    this.secretStore.set("apiKey", apiKey);
  }

  static getLocation(): { latitude: number; longitude: number } | null {
    this.migrateLegacySettings();

    const location = this.getSetting<{ latitude: number; longitude: number } | null>("location", null);

    if (!location || location.latitude === null || location.longitude === null) {
      return null;
    }

    return location;
  }

  static setLocation(latitude: number | null, longitude: number | null): void {
    this.migrateLegacySettings();

    if (latitude === null || longitude === null) {
      this.setSetting("location", null);
      return;
    }

    this.setSetting("location", { latitude, longitude });
  }

  private static getSetting<T>(key: string, fallback: T): T {
    const row = getDatabase().prepare("SELECT value_json FROM application_settings WHERE key = ?").get(key) as { value_json: string } | undefined;
    return row ? (JSON.parse(row.value_json) as T) : fallback;
  }

  private static setSetting(key: string, value: unknown): void {
    getDatabase()
      .prepare(
        `INSERT INTO application_settings (key, value_json, updated_at)
         VALUES (?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at`
      )
      .run(key, JSON.stringify(value), new Date().toISOString());
  }

  private static migrateLegacySettings(): void {
    const migrationKey = "migration.legacy_settings_v1";

    if (this.getSetting<boolean>(migrationKey, false)) {
      return;
    }

    const legacyLocation = this.secretStore.get("location");
    if (legacyLocation) {
      this.setSetting("location", legacyLocation);
    }

    this.setSetting(migrationKey, true);
  }
}
