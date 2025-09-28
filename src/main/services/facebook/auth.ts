import { User } from "../../../shared/types";
import { PlaywrightManager } from "../browser/playwright";
import cheerio from "cheerio";

export class FacebookAuth {
  private static readonly SELECTORS = {
    profileName: "ul li:first-child a span span.x1lliihq.x6ikm8r.x10wlt62.x1n2onr6",
    profilePicture: "ul li:first-child image",
    loggedInIndicator: 'span:has-text("on your mind")',
    welcomeMessage: 'span:has-text("Welcome to Facebook")',
    accountButton: 'div[aria-label="Your profile"]',
    logoutButton: 'span:has-text("Log Out")'
  };

  private static extractUserInfoFromHTML(html: string): User | null {
    const $ = cheerio.load(html);

    const profileName = $(this.SELECTORS.profileName).first().text().trim();
    const profilePicture = $(this.SELECTORS.profilePicture).attr("href");

    if (!profileName) {
      return null;
    }

    return {
      name: profileName,
      profilePicture: profilePicture || ""
    };
  }

  static async login(): Promise<User | null> {
    const browser = await PlaywrightManager.createFacebookContext({
      headless: false,
      viewport: { width: 800, height: 600 }
    });

    try {
      const [page] = browser.pages();
      await page.goto("https://www.facebook.com");
      await page.waitForSelector(this.SELECTORS.loggedInIndicator, { timeout: 0 });
      const html = await page.content();
      const user = this.extractUserInfoFromHTML(html);
      await browser.close();
      return user;
    } catch (error) {
      console.error("Error during Facebook login:", error);
      await browser.close();
      return null;
    }
  }

  static async checkSession(): Promise<User | null> {
    const browser = await PlaywrightManager.createFacebookContext();

    const [page] = browser.pages();
    await page.goto("https://www.facebook.com");
    const html = await page.content();
    const user = this.extractUserInfoFromHTML(html);
    await browser.close();
    return user;
  }

  static async logout(): Promise<boolean> {
    const browser = await PlaywrightManager.createFacebookContext({ headless: true, viewport: { width: 1200, height: 600 } });

    try {
      const [page] = browser.pages();
      await page.goto("https://www.facebook.com");
      await page.click(this.SELECTORS.accountButton, { timeout: 5000 });
      await page.click(this.SELECTORS.logoutButton);
      //wait 1 second to ensure logout completes
      await page.waitForTimeout(1000);
      await browser.close();
      console.log("Logged out of Facebook successfully.");
      return true;
    } catch (error) {
      console.error("Error during Facebook logout:", error);
      await browser.close();
      return false;
    }
  }
}
