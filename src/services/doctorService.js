import api from "./api";

const doctorService = {
  getDoctors: async (specialization = "") => {
    if (!specialization) {
      const response = await api.get("/doctors/all");
      return response.data;
    }

    const response = await api.get("/doctors", {
      params: {
        specialization,
      },
    });

    return response.data;
  },

  getDoctorById: async (doctorId) => {
    const response = await api.get(
      `/doctors/${doctorId}`
    );

    return response.data;
  },

  getAvailableSlots: async (doctorId, date) => {
    const response = await api.get(
      `/doctors/${doctorId}/available-slots`,
      {
        params: {
          date,
        },
      }
    );

    return response.data;
  },
};

export default doctorService;