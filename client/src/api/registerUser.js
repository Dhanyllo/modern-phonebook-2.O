import axiosClient from "../api/axiosClient";

export async function registerUser(apiUrl, payload) {
  try {
    const res = await axiosClient.post(`${apiUrl}/auth/signup`, payload, {
      withCredentials: true,
    });

    return res.data;
  } catch (err) {
    const error = new Error(
      err.response?.data?.message || "Registration failed",
    );

    error.status = err.response?.status || 500;

    throw error;
  }
}
