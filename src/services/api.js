import axios from "axios";
import { clearTokens } from "../utils/tokenUtils";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================================
// PUBLIC ENDPOINTS
// =====================================================

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

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
  (config) => {
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

// =====================================================
// RESPONSE INTERCEPTOR
// TOKEN EXPIRED / UNAUTHORIZED
// =====================================================

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;

    if (status === 401) {
      const requestUrl = originalRequest?.url || "";

      const isAuthRequest = [
        "/auth/login",
        "/auth/register",
        "/auth/verify-registration",
        "/auth/resend-registration-otp",
        "/auth/otp/request",
        "/auth/otp/verify",
        "/auth/forgot-password",
        "/auth/reset-password",
        "/auth/refresh",
      ].some((endpoint) => requestUrl.includes(endpoint));

      if (!isAuthRequest) {
        const role = (
          localStorage.getItem("userRole") || ""
        )
          .replace(/^ROLE_/i, "")
          .toUpperCase();

        clearTokens();

        const loginPaths = {
          ADMIN: "/admin/login",
          DOCTOR: "/doctor/login",
          PATIENT: "/patient/login",
          RECEPTIONIST: "/receptionist/login",
          NURSE: "/nurse/login",
          LAB_TECHNICIAN: "/lab-technician/login",
        };

        const loginPath = loginPaths[role] || "/";

        if (window.location.pathname !== loginPath) {
          window.location.replace(loginPath);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;