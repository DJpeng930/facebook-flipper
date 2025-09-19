import { app } from "electron";
import path from "path";

export const FB_PROFILE_PATH = path.join(app.getPath("userData"), "fb-profile");
