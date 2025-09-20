import { ElectronAPI } from "@electron-toolkit/preload";

export interface Api {
  // Define your custom API methods and properties here
  ping: () => void;
  openFBLogin: () => Promise<boolean>;
  checkForFBSession: () => Promise<boolean>;
  fbLogOut: () => Promise<void>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: Api;
  }
}
