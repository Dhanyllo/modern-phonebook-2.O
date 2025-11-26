import axiosClient from "./axiosClient";

export async function fetchOccupations(apiUrl, contactId) {
  try {
    const res = await axiosClient.get(
      `${apiUrl}/detail/occupations/${contactId}`,
      {
        withCredentials: true,
      }
    );

    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      window.location.href = "/login";
      return; // stop execution
    }

    // Handle all other HTTP errors
    const error = new Error("Failed to fetch occupations");
    error.status = err.response ? err.response.status : 500;
    throw error;
  }
}
