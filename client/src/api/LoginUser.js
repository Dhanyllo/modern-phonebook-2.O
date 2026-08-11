import axiosClient from "../api/axiosClient";

export async function loginUser(apiUrl, payload) {
  try {
    const res = await axiosClient.post(`${apiUrl}/auth/login`, payload, {
      withCredentials: true,
    });

    return res.data;
  } catch (err) {
    const error = new Error(err.response?.data?.message || "Login failed");

    error.status = err.response?.status || 500;

    throw error;
  }
}
