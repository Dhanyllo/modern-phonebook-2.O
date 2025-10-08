// src/utils/checkAuth.js
export const checkAuth = async (apiUrl) => {
  try {
    const res = await fetch(`${apiUrl}/auth/check`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) return { redirectToLogin: true };

    const data = await res.json();
    if (!data.authenticated) return { redirectToLogin: true };

    return data;
  } catch (err) {
    console.error("Auth check failed:", err);
    return { redirectToLogin: true };
  }
};
