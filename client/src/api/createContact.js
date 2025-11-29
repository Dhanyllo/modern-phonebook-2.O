import axiosClient from "./axiosClient";

export async function createContact(apiUrl, formData) {
  try {
    const res = await axiosClient.post(`${apiUrl}/contacts`, formData, {
      withCredentials: true,
    });

    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      const error = new Error("Not authenticated");
      error.status = 401;
      throw error;
    }

    const error = new Error("Failed to create contact");
    error.status = err.response ? err.response.status : 500;
    throw error;
  }
}
