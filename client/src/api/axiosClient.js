import axios from "axios";

axios.defaults.withCredentials = true;

const apiUrl = import.meta.env.VITE_API_URL;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve()));
  failedQueue = [];
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axios(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(`${apiUrl}/api/refresh-token`, {
          withCredentials: true,
        });

        processQueue(null);
        return axios(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
