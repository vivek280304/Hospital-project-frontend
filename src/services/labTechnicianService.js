import api from "./api";

const labTechnicianService = {
  async getProfile() {
    const response = await api.get("/lab-technician/profile");
    return response.data;
  },

  async getLabOrders(status = "ORDERED") {
    const response = await api.get(
      "/lab-technician/patient-orders",
      {
        params: { status },
      }
    );

    return response.data;
  },

  async claimOrder(orderId) {
    const response = await api.post(
      `/lab-technician/patient-orders/${orderId}/claim`
    );

    return response.data;
  },

  async collectSample(orderId) {
    const response = await api.post(
      `/lab-technician/patient-orders/${orderId}/collect-sample`
    );

    return response.data;
  },

  async startProcessing(orderId) {
    const response = await api.post(
      `/lab-technician/patient-orders/${orderId}/start-processing`
    );

    return response.data;
  },

  async completeOrder(orderId, data) {
    const response = await api.post(
      `/lab-technician/orders/${orderId}/complete`,
      data
    );

    return response.data;
  },

  async getPendingImagingOrders() {
    const response = await api.get(
      "/lab-technician/imaging-orders/pending"
    );

    return response.data;
  },

  async uploadImaging(orderId, formData) {
    const response = await api.post(
      `/lab-technician/imaging-orders/${orderId}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },
};

export default labTechnicianService;