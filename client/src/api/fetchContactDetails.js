import axiosClient from "./axiosClient";

export async function fetchContactDetails(apiUrl, contactId) {
  try {
    const res = await axiosClient.get(`${apiUrl}/detail/${contactId}`, {
      withCredentials: true,
    });

    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      // Redirect immediately
      window.location.href = "/login";
      return; // prevent further execution
    }

    const error = new Error("Failed to fetch contact details");
    error.status = err.response ? err.response.status : 500;
    throw error;
  }
}
