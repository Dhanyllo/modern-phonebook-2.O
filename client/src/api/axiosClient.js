import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

axios.defaults.withCredentials = true;

// A separate client that DOES NOT use interceptors.
// Used ONLY for refresh.
const refreshClient = axios.create({
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });

  failedQueue = [];
};

axios.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    if (originalRequest.url.includes("/api/refresh-token")) {
      return Promise.reject(error);
    }

    // Handle 401 only ONCE per request
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If refresh is already happening → queue the request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axios(originalRequest));
      }

      isRefreshing = true;

      try {
        // 🔁 Try refreshing (no interceptor here!)
        await refreshClient.post(`${apiUrl}/api/refresh-token`);

        processQueue(null);
        return axios(originalRequest); // retry original request
      } catch (refreshErr) {
        // Refresh failed → reject EVERYTHING
        processQueue(refreshErr);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // Any other error → bubble up normally
    return Promise.reject(error);
  }
);

export default axios;
