import api from "./api";
import { saveTokens, clearTokens } from "../utils/tokenUtils";

const authService = {
  async login(data) {
    const response = await api.post("/auth/login", data);

    saveTokens(response.data);

    return response.data;
  },

  async requestOtp(data) {
    const response = await api.post("/auth/otp/request", data);

    return response.data;
  },

  async verifyOtp(data) {
    const response = await api.post("/auth/otp/verify", data);

    saveTokens(response.data);

    return response.data;
  },

  async forgotPassword(data) {
    const response = await api.post(
      "/auth/forgot-password",
      data
    );

    return response.data;
  },

  async resetPassword(data) {
    const response = await api.post(
      "/auth/reset-password",
      data
    );

    return response.data;
  },

  async register(data) {
    const response = await api.post(
      "/auth/register",
      data
    );

    return response.data;
  },

  async verifyRegistration(data) {
    const response = await api.post(
      "/auth/verify-registration",
      data
    );

    return response.data;
  },

  async resendRegistrationOtp(data) {
    const response = await api.post(
      "/auth/resend-registration-otp",
      data
    );

    return response.data;
  },

  async refresh(refreshToken) {
    const response = await api.post(
      "/auth/refresh",
      { refreshToken }
    );

    saveTokens(response.data);

    return response.data;
  },

  async logout(refreshToken) {
    try {
      await api.post("/auth/logout", {
        refreshToken,
      });
    } finally {
      clearTokens();
    }
  },

  async changePassword(data) {
    const response = await api.post(
      "/auth/change-password",
      data
    );

    return response.data;
  },
};

export default authService;