import playwright from "patchright";
import { app } from "electron";
import path from "path";
import type { BrowserContext } from "patchright";

interface BrowserConfig {
  headless?: boolean;
  viewport?: { width: number; height: number };
}

export class PlaywrightManager {
  private static FB_PROFILE_PATH = path.join(app.getPath("userData"), "fb-profile");

  private static defaultConfig: BrowserConfig = {
    headless: true
  };

  /**
   * Creates a persistent browser context for Facebook operations
   */
  static async createFacebookContext(config?: BrowserConfig) {
    try {
      const context = await playwright.chromium.launchPersistentContext(this.FB_PROFILE_PATH, {
        ...this.defaultConfig,
        ...config,
        channel: "chrome"
      });

      return context;
    } catch (error) {
      console.error("Failed to create facebook browser context:", error);
      throw error;
    }
  }

  public static async openBrowserWithFacebookContext() {
    let context: BrowserContext | undefined;
    try {
      context = await PlaywrightManager.createFacebookContext({ headless: false });
      const page = await context.newPage();
      await page.goto(`https://www.facebook.com`);
    } catch {
      context?.close();
    }
  }
}
