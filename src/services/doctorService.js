import api from "./api";

const doctorService = {
  // =========================
  // DOCTOR PROFILE
  // =========================
  getProfile: async () => {
    const response = await api.get("/doctor/profile");
    return response.data;
  },

  getDoctorById: async (doctorId) => {
  const response = await api.get(`/doctors/${doctorId}`);
  return response.data;
},

    getDoctors: async (specialization = "") => {
    let response;

    if (specialization.trim()) {
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


  // =========================
  // APPOINTMENTS
  // =========================
  getAppointments: async (date) => {
    const response = await api.get("/doctor/appointments", {
      params: { date },
    });

    return response.data;
  },

  completeAppointment: async (appointmentId) => {
    const response = await api.patch(
      `/doctor/appointments/${appointmentId}/complete`
    );

    return response.data;
  },

  // =========================
  // MEDICAL REPORT
  // =========================
  createMedicalReport: async (appointmentId, data) => {
    const response = await api.post(
      `/doctor/appointments/${appointmentId}/report`,
      data
    );

    return response.data;
  },

 

  // =========================
  // PATIENTS
  // =========================
  getMyPatients: async () => {
    const response = await api.get("/doctor/patients");
    return response.data;
  },

  getPatientHistory: async (patientId) => {
    const response = await api.get(
      `/doctor/patients/${patientId}/history`
    );

    return response.data;
  },

  // =========================
  // PATIENT REPORTS
  // =========================
  getPatientReports: async (patientId) => {
    const response = await api.get(
      `/doctor/patients/${patientId}/reports`
    );

    return response.data;
  },

  // =========================
  // IMAGING ORDERS
  // =========================
  getImagingOrders: async () => {
    const response = await api.get("/doctor/imaging-orders");
    return response.data;
  },

  // =========================
  // SHARED PATIENTS
  // =========================
  getSharedPatients: async () => {
    const response = await api.get("/doctor/shared-patients");
    return response.data;
  },

  getSharedPatientReports: async (patientId) => {
    const response = await api.get(
      `/doctor/shared-patients/${patientId}/reports`
    );

    return response.data;
  },

  getSharedPatientImaging: async (patientId) => {
    const response = await api.get(
      `/doctor/shared-patients/${patientId}/imaging`
    );

    return response.data;
  },

 sharePatient: async (patientId, data) => {
  const response = await api.post(
    `/doctor/patient/${patientId}/share`,
    {
      juniorDoctorID: Number(data.juniorDoctorID),
    }
  );

  return response.data;
},

getSharedPatientLabResults: async (patientId) => {
  const response = await api.get(
    `/doctor/shared-patients/${patientId}/lab-results`
  );

  return response.data;
},


};

export default doctorService;