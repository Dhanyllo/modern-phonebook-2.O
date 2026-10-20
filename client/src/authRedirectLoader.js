import { redirect } from "react-router-dom";
import { checkAuthStatus } from "./api/checkAuthStatus.js";

export async function authRedirectLoader() {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const authData = await checkAuthStatus(apiUrl);

    if (authData.authenticated) {
      return redirect("/", { replace: true });
    }

    return null;
  } catch (error) {
    if (error.response?.status === 401) {
      // User is not authenticated; allow access.
      return null;
    }

    throw error;
  }
}
