import { FacebookAuth } from "../services/facebook/auth";

export async function fbLogOut(): Promise<void> {
  await FacebookAuth.logout();
}
