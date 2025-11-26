import axiosClient from "./axiosClient";

export async function fetchSearchResults(apiUrl, searchTerm, page, limit) {
  const encoded = encodeURIComponent(searchTerm);

  try {
    const res = await axiosClient.get(
      `${apiUrl}/search/favourites?searchParams=${encoded}&page=${page}&limit=${limit}`,
      { withCredentials: true }
    );

    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      const error = new Error("Not authenticated");
      error.status = 401;
      throw error;
    }

    const error = new Error("Failed to fetch results");
    error.status = err.response ? err.response.status : 500;
    throw error;
  }
}
