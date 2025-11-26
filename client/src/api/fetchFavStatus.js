import axiosClient from "./axiosClient";

export async function fetchFavStatus(apiUrl) {
  try {
    const res = await axiosClient.get(`${apiUrl}/favstatus`, {
      withCredentials: true,
    });

    return res.data;
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
