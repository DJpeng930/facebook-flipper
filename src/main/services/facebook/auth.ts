import { PlaywrightManager } from "../browser/playwright";

export class FacebookAuth {
  private static readonly LOGGED_IN_SELECTOR = 'span:has-text("on your mind")';

  static async login(): Promise<boolean> {
    const browser = await PlaywrightManager.createFacebookContext({
      headless: false,
      viewport: { width: 800, height: 600 }
    });

    try {
      const [page] = browser.pages();
      await page.goto("https://www.facebook.com");
      await page.waitForSelector(this.LOGGED_IN_SELECTOR);
      await browser.close();
      return true;
    } catch (error) {
      console.error("Error during Facebook login:", error);
      await browser.close();
      return false;
    }
  }

  static async checkSession(): Promise<boolean> {
    const browser = await PlaywrightManager.createFacebookContext();

    const [page] = browser.pages();
    await page.goto("https://www.facebook.com");

    try {
      await page.waitForSelector(this.LOGGED_IN_SELECTOR, { timeout: 100 });
      await browser.close();
      return true;
    } catch {
      await browser.close();
      return false;
    }
  }

  static async logout(): Promise<void> {
    await PlaywrightManager.deleteFacebookProfile();
  }
}
