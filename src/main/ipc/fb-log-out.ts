import fs from "fs";
import { FB_PROFILE_PATH } from "../constants/paths";

export async function fbLogOut(): Promise<void> {
  // delete the fb-profile directory and all its contents
  await fs.promises.rm(FB_PROFILE_PATH, { recursive: true, force: true });
}
