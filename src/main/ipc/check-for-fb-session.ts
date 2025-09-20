import { FB_PROFILE_PATH } from "../constants/paths";
import playwright from "patchright";

export async function checkForFBSession() {
  // Path to store your Facebook session

  const browser = await playwright.chromium.launchPersistentContext(FB_PROFILE_PATH, {
    channel: "chrome",
    headless: true
  });

  const [page] = browser.pages(); // get the blank page created by launchPersistentContext
  await page.goto("https://www.facebook.com");

  //Check if logged in by looking for "on your mind" text
  try {
    await page.waitForSelector('span:has-text("on your mind")', { timeout: 1000 });
    console.log("[session-checker]:Logged in");

    await browser.close();
    return true;
  } catch {
    console.log("[session-checker]:Not logged in");
    await browser.close();
    return false;
  }
}
