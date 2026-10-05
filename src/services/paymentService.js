import api from "./api";

const paymentService = {

  async createAppointmentPayment(data) {
    const response = await api.post(
      "/patient/appointments/payment",
      data
    );

    return response.data;
  },

};

export default paymentService;