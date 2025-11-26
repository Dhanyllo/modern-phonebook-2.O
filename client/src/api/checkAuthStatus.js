import axiosClient from "./axiosClient";

export const checkAuthStatus = async (apiUrl) => {
  try {
    const res = await axiosClient.get(`${apiUrl}/auth/check`, {
      withCredentials: true,
    });

    const data = res.data;

    if (!data.authenticated) return { redirectToLogin: true };

    return data;
  } catch (err) {
    console.error("Auth check failed:", err);
    return { redirectToLogin: true };
  }
};
