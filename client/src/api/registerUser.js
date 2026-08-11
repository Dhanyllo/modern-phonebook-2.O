import axiosClient from "../api/axiosClient";

export async function registerUser(apiUrl, payload) {
  try {
    const res = await axiosClient.post(`${apiUrl}/auth/signup`, payload, {
      withCredentials: true,
    });

    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 400) {
      const error = new Error(
        err.response.data?.message || "Registration failed",
      );
      error.status = 400;
      throw error;
    }

    const error = new Error("Server error during registration");
    error.status = err.response ? err.response.status : 500;
    throw error;
  }
}
