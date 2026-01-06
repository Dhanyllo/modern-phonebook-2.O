import axiosClient from "./axiosClient";

export async function fetchMyProfile(apiUrl) {
  try {
    const res = await axiosClient.get(`${apiUrl}/me`, {
      withCredentials: true,
    });

    return res.data.user;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      const error = new Error("Not authenticated");
      error.status = 401;
      throw error;
    }

    const error = new Error("Request failed");
    error.status = err.response ? err.response.status : 500;
    throw error;
  }
}
