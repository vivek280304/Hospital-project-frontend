import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const publicEndpoints = [
      "/auth/login",
      "/auth/register",
      "/auth/verify-registration",
      "/auth/resend-registration-otp",
      "/auth/otp/request",
      "/auth/otp/verify",
      "/auth/forgot-password",
      "/auth/reset-password",
      "/auth/refresh",
      "/doctors",
    ];

    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.startsWith(endpoint)
    );

    if (!isPublicEndpoint) {
      const token = localStorage.getItem("accessToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;