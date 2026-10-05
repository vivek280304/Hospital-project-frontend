import api from "./api";

const paymentService = {

  async createAppointmentPayment(data) {
    const response = await api.post(
      "/patient/appointments/payment",
      data
    );

    return response.data;
  },

  async getPaymentStatus(orderId) {
    const response = await api.get(
      `/patient/appointments/payment/${orderId}/status`
    );

    return response.data;
  },

};

export default paymentService;