import { FacebookAuth } from "../services/facebook/auth";

export async function fbLogOut(): Promise<boolean> {
  return await FacebookAuth.logout();
}
