import axios from "axios";
import { clearTokens } from "../utils/tokenUtils";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
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

    // -------------------------------------------------
    // Only handle authentication failure
    // -------------------------------------------------

    if (status === 401) {

      // Don't redirect if the failed request itself
      // is a login/authentication request.
      const requestUrl = originalRequest?.url || "";

      const isAuthRequest =
        requestUrl.includes("/auth/login") ||
        requestUrl.includes("/auth/register") ||
        requestUrl.includes("/auth/verify-registration") ||
        requestUrl.includes("/auth/otp/request") ||
        requestUrl.includes("/auth/otp/verify") ||
        requestUrl.includes("/auth/forgot-password") ||
        requestUrl.includes("/auth/reset-password") ||
        requestUrl.includes("/auth/refresh");

      if (!isAuthRequest) {

        // Get current role BEFORE clearing tokens
        const role = (
          localStorage.getItem("userRole") || ""
        )
          .replace(/^ROLE_/i, "")
          .toUpperCase();

        // Clear expired session
        clearTokens();

        // -------------------------------------------------
        // Redirect according to role
        // -------------------------------------------------

        const loginPaths = {
          ADMIN: "/admin/login",
          DOCTOR: "/doctor/login",
          PATIENT: "/patient/login",
          RECEPTIONIST: "/receptionist/login",
          NURSE: "/nurse/login",
          LAB_TECHNICIAN: "/lab-technician/login",
        };

        const loginPath =
          loginPaths[role] || "/";

        // Prevent repeated redirects
        if (window.location.pathname !== loginPath) {
          window.location.replace(loginPath);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;