import playwright from "playwright";
import { FB_PROFILE_PATH } from "../constants/paths";

export async function openFBLogin() {
  // Launch a persistent context
  const browser = await playwright.chromium.launchPersistentContext(FB_PROFILE_PATH, {
    headless: false, // keep visible for login
    viewport: { width: 800, height: 600 }
  });

  try {
    const [page] = browser.pages(); // get the blank page created by launchPersistentContext
    await page.goto("https://www.facebook.com");

    //wait for welcome text
    await page.waitForSelector('span:has-text("on your mind")');
    await browser.close();

    return true;
  } catch (error) {
    console.error("Error during Facebook login:", error);
    await browser.close();
    return false;
  }
}
