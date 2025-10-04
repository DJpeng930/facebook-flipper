import Store from "electron-store";
import { AppSettings } from "../../../shared/types";

export class SettingsRepository {
  private static store = new Store<AppSettings>({
    name: "settings",
    encryptionKey: "d",
    defaults: {
      apiKey: "",
      location: null
    }
  });

  static getApiKey(): string {
    return this.store.get("apiKey");
  }

  static setApiKey(apiKey: string): void {
    this.store.set("apiKey", apiKey);
  }

  static getLocation(): { latitude: number; longitude: number } | null {
    const location = this.store.get("location");

    if (!location || location.latitude === null || location.longitude === null) {
      return null;
    }

    return location;
  }

  static setLocation(latitude: number | null, longitude: number | null): void {
    if (latitude === null || longitude === null) {
      this.store.set("location", null);
      return;
    }

    this.store.set("location", { latitude, longitude });
  }
}
