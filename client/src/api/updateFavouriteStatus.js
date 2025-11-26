import axiosClient from "./axiosClient";

export async function updateFavouriteStatus(apiUrl, id, newStatus) {
  try {
    const res = await axiosClient.patch(
      `${apiUrl}/update/${id}`,
      { favourite_status: newStatus },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      const error = new Error("Not authenticated");
      error.status = 401;
      throw error;
    }

    const error = new Error("Failed to update status");
    error.status = err.response ? err.response.status : 500;
    throw error;
  }
}
