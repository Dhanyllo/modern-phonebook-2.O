import axiosClient from "../api/axiosClient";

export async function verifyOtp(apiUrl, payload) {
  try {
    const res = await axiosClient.post(`${apiUrl}/auth/verify-otp`, payload, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    if (err.response?.status === 400) {
      const error = new Error(err.response.data?.message || "Invalid OTP");
      error.status = 400;
      throw error;
    }

    const error = new Error("OTP verification failed");
    error.status = err.response ? err.response.status : 500;
    throw error;
  }
}
