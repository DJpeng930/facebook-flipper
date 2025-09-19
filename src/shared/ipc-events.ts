export const IPC_EVENTS = {
  OPEN_FB_LOGIN: "OPEN_FB_LOGIN",
  CHECK_FOR_FB_SESSION: "CHECK_FOR_FB_SESSION"
} as const;

export type IPCEventNames = (typeof IPC_EVENTS)[keyof typeof IPC_EVENTS];
