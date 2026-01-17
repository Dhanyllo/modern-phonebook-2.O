// contactService.js
import axiosClient from "./axiosClient";

export async function deleteContact(apiUrl, contactId) {
  try {
    const res = await axiosClient.delete(`${apiUrl}/contacts/${contactId}`, {
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

    // Optional: handle not found
    if (err.response && err.response.status === 404) {
      const error = new Error("Contact not found");
      error.status = 404;
      throw error;
    }

    // Default error handling
    const error = new Error("Failed to delete contact");
    error.status = err.response ? err.response.status : 500;
    throw error;
  }
}
