import axiosClient from "./axiosClient";

export const logoutUser = async (apiUrl) => {
  try {
    const res = await axiosClient.post(
      `${apiUrl}/api/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    return res.data;
  } catch (err) {
    const status = err.response ? err.response.status : "no response";
    throw new Error("Logout failed, server returned: " + status);
  }
};
