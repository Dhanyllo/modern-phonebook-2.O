import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      onError: (error) => {
        console.log("GLOBAL HANDLER:", error);
        if (error?.status === 401 || error?.message === "Not authenticated") {
          window.location.href = "/login";
        }
      },
    },
    mutations: {
      onError: (error) => {
        if (error?.status === 401) {
          window.location.href = "/login";
        }
      },
    },
  },
});
