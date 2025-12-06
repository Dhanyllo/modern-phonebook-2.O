import axiosClient from "./axiosClient";

export async function updateContact(apiUrl, formData, id) {
  try {
    const res = await axiosClient.put(`${apiUrl}/contacts/${id}`, formData, {
      withCredentials: true,
    });

    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      const error = new Error("Not authenticated");
      error.status = 401;
      throw error;
    }

    const error = new Error("Failed to update contact");
    error.status = err.response ? err.response.status : 500;
    throw error;
  }
}
