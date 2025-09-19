import { ipcMain } from "electron";
import { IPC_EVENTS } from "../../shared/ipc-events";
import { checkForFBSession } from "./check-for-fb-session";
import { openFBLogin } from "./open-fb-login";

// IPC handler to open Facebook login window
ipcMain.handle(IPC_EVENTS.CHECK_FOR_FB_SESSION, checkForFBSession);
ipcMain.handle(IPC_EVENTS.OPEN_FB_LOGIN, openFBLogin);
