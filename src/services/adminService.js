import api from "./api";

const adminService = {
  // ==========================================
  // CREATE USER
  // POST /api/admin/create-users
  // ==========================================
  createUser: async (data) => {
    const response = await api.post(
      "/admin/create-users",
      data
    );

    return response.data;
  },

  // ==========================================
  // FIND USER BY EMAIL
  // GET /api/admin/users/search?email=...
  // ==========================================
  findUserByEmail: async (email) => {
    const response = await api.get(
      "/admin/users/search",
      {
        params: {
          email,
        },
      }
    );

    return response.data;
  },

  // ==========================================
  // LOCK USER ACCOUNT
  // PATCH /api/admin/users/{id}/lock
  // ==========================================
  lockUser: async (userId) => {
    const response = await api.patch(
      `/admin/users/${userId}/lock`
    );

    return response.data;
  },

  // ==========================================
  // UNLOCK USER ACCOUNT
  // PATCH /api/admin/users/{id}/unlock
  // ==========================================
  unlockUser: async (userId) => {
    const response = await api.patch(
      `/admin/users/${userId}/unlock`
    );

    return response.data;
  },

  // ==========================================
  // CREATE DOCTOR SCHEDULE
  // POST /api/admin/doctor-schedules
  // ==========================================
  createDoctorSchedule: async (data) => {
    const response = await api.post(
      "/admin/doctor-schedules",
      data
    );

    return response.data;
  },
};

export default adminService;