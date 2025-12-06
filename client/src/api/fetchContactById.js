import axiosClient from "./axiosClient";

export async function fetchContactById(apiUrl, id) {
  try {
    const res = await axiosClient.get(`${apiUrl}/contacts/${id}`, {
      withCredentials: true,
    });

    return res.data;
  } catch (err) {
    // Handle unauthorized (401) separately
    if (err.response && err.response.status === 401) {
      const error = new Error("Not authenticated");
      error.status = 401;
      throw error;
    }

    // Default error handling
    const error = new Error("Failed to fetch contact");
    error.status = err.response ? err.response.status : 500;
    throw error;
  }
}
