import axiosClient from "./axiosClient";

export async function fetchFavourites(apiUrl, page, limit) {
  try {
    const res = await axiosClient.get(
      `${apiUrl}/favourites?page=${page}&limit=${limit}`,
      {
        withCredentials: true,
      }
    );

    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      const error = new Error("Not authenticated");
      error.status = 401;
      throw error;
    }

    const error = new Error("Failed to fetch favourites");
    error.status = err.response ? err.response.status : 500;
    throw error;
  }
}
