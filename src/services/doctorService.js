import api from "./api";

const doctorService = {
  // Get all doctors or filter by specialization
  getDoctors: async (specialization = "") => {
    let response;

    if (specialization && specialization.trim() !== "") {
      response = await api.get("/doctors", {
        params: {
          specialization: specialization.trim(),
        },
      });
    } else {
      response = await api.get("/doctors/all");
    }

    return response.data;
  },

  // Get one doctor
  getDoctorById: async (doctorId) => {
    const response = await api.get(`/doctors/${doctorId}`);
    return response.data;
  },

  // Get available appointment slots
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

  // Doctor logged-in profile
  getProfile: async () => {
    const response = await api.get("/doctor/profile");
    return response.data;
  },

  // Doctor appointments
  getAppointments: async (date) => {
    const response = await api.get("/doctor/appointments", {
      params: {
        date,
      },
    });

    return response.data;
  },

  // Complete appointment
  completeAppointment: async (appointmentId) => {
    const response = await api.patch(
      `/doctor/appointments/${appointmentId}/complete`
    );

    return response.data;
  },

  // Patient details for doctor
  getPatientDetails: async (appointmentId) => {
    const response = await api.get(
      `/doctor/appointments/${appointmentId}/patient`
    );

    return response.data;
  },

  // Patient reports
  getPatientReports: async (patientId) => {
    const response = await api.get(
      `/doctor/patients/${patientId}/reports`
    );

    return response.data;
  },

  // Imaging orders
  getImagingOrders: async () => {
    const response = await api.get("/doctor/imaging-orders");
    return response.data;
  },

  // Shared patients
  getSharedPatients: async () => {
    const response = await api.get("/doctor/shared-patients");
    return response.data;
  },
};

export default doctorService;