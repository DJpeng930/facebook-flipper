import { FacebookAuth } from "../services/facebook/auth";

export async function openFBLogin() {
  return await FacebookAuth.login();
}
