import api from "./api";

const patientService = {
  getProfile: async () => {
    const response = await api.get("/patient/profile");
    return response.data;
  },

  getAppointments: async () => {
    const response = await api.get(
      "/patient/get-all-appointments"
    );
    return response.data;
  },

  getDoctors: async (day, specialization = "") => {
    const response = await api.get("/patient/doctors", {
      params: {
        day,
        ...(specialization
          ? { specialization }
          : {}),
      },
    });

    return response.data;
  },

  bookAppointment: async (data) => {
    const response = await api.post(
      "/patient/appointments",
      data
    );

    return response.data;
  },

  cancelAppointment: async (appointmentId) => {
    const response = await api.delete(
      `/patient/appointments/${appointmentId}`
    );

    return response.data;
  },

  getReports: async () => {
    const response = await api.get(
      "/patient/reports"
    );

    return response.data;
  },

  getImaging: async () => {
    const response = await api.get(
      "/patient/imaging"
    );

    return response.data;
  },

  getAvailableLabTests: async () => {
    const response = await api.get(
      "/patient/lab-tests"
    );

    return response.data;
  },

  bookLabTest: async (data) => {
    const response = await api.post(
      "/patient/lab-tests/orders",
      data
    );

    return response.data;
  },

  getLabOrders: async () => {
    const response = await api.get(
      "/patient/lab-tests/get-orders"
    );

    return response.data;
  },

  getLabResult: async (orderId) => {
    const response = await api.get(
      `/patient/lab-tests/get-orders/${orderId}/result`
    );

    return response.data;
  },

  bookAppointment: async (data) => {
  const response = await api.post("/patient/appointments", data);
  return response.data;
},

};

export default patientService;