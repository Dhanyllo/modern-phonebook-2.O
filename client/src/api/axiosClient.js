import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

/**
 * Main API client.
 *
 * All normal API requests should use this client.
 */
const axiosClient = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

/**
 * Separate client for refreshing the access token.
 *
 * IMPORTANT:
 * This client intentionally has NO response interceptor.
 * Otherwise a failed refresh could trigger another refresh request
 * and create an infinite loop.
 */
const refreshClient = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

/**
 * Resolve or reject requests that were waiting for
 * the access-token refresh to complete.
 */
const processQueue = (error = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  failedQueue = [];
};

/**
 * Requests that should NEVER trigger automatic
 * access-token refreshing.
 */
const authEndpoints = [
  "/auth/login",
  "/auth/signup",
  "/auth/verify-otp",
  "/auth/logout",
  "/api/refresh-token",
];

const isAuthEndpoint = (url = "") =>
  authEndpoints.some((endpoint) => url.includes(endpoint));

/**
 * Response interceptor.
 *
 * If an authenticated request returns 401:
 *
 * 1. Attempt to refresh the access token.
 * 2. If another refresh is already running, queue the request.
 * 3. Once refresh succeeds, retry the failed requests.
 * 4. If refresh fails, reject them all.
 */
axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // No response or request configuration.
    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    // Authentication endpoints must handle their own 401 responses.
    if (isAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    // Only handle unauthorized requests.
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent the same request from triggering refresh repeatedly.
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    /**
     * A refresh request is already in progress.
     *
     * Wait for it to finish instead of starting another refresh.
     */
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(axiosClient(originalRequest)),
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      /**
       * Attempt to refresh the access token.
       *
       * The refresh token is automatically sent through
       * the HttpOnly cookie because withCredentials is enabled.
       */
      await refreshClient.post("/api/refresh-token");

      /**
       * Refresh succeeded.
       *
       * Retry all requests that were waiting.
       */
      processQueue();

      /**
       * Retry the request that originally caused the refresh.
       */
      return axiosClient(originalRequest);
    } catch (refreshError) {
      /**
       * Refresh failed.
       *
       * Every queued request should fail as well.
       */
      processQueue(refreshError);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosClient;
