import { FacebookAuth } from "../services/facebook/auth";

export async function checkForFBSession() {
  // Path to store your Facebook session

  return await FacebookAuth.checkSession();
}
