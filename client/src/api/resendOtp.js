import axiosClient from "../api/axiosClient";

export async function resendOtp() {
  try {
    await axiosClient.post("/auth/resend-otp", {}, { withCredentials: true });
  } catch (err) {
    const error = new Error("Failed to resend OTP");
    error.status = err.response ? err.response.status : 500;
    throw error;
  }
}
