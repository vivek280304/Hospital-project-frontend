import api from "./api";

const receptionistService = {
  // =========================
  // PROFILE
  // =========================
  getProfile: async () => {
    const response = await api.get("/receptionist/profile");
    return response.data;
  },

  // =========================
  // PATIENTS
  // =========================
  searchPatients: async (query) => {
    const response = await api.get("/receptionist/patients/search", {
      params: { query },
    });

    return response.data;
  },

  createPatient: async (data) => {
    const response = await api.post(
      "/receptionist/create-patient",
      data
    );

    return response.data;
  },

  // =========================
  // DOCTORS / SCHEDULES
  // =========================
  getDoctorSchedule: async (doctorId) => {
  const response = await api.get(
    `/receptionist/doctors/${doctorId}/schedule`
  );

  return response.data;
},


  getAvailableSlots: async (doctorId, date) => {
  const response = await api.get(
    `/receptionist/doctors/${doctorId}/available-slots`,
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
  bookAppointment: async (patientId, data) => {
  const response = await api.post(
    `/receptionist/appointments/${patientId}`,
    data
  );

  return response.data;
},

  // This requires the GET /api/receptionist/appointments
  // endpoint we added in your backend.
  getAppointments: async (date) => {
    const response = await api.get(
      "/receptionist/appointments",
      {
        params: { date },
      }
    );

    return response.data;
  },

 getDoctorLeaves: async (doctorId) => {
  const response = await api.get(
    `/receptionist/doctors/${doctorId}/leaves`
  );

  return response.data;
},

createDoctorLeave: async (doctorId, data) => {
  const response = await api.post(
    `/receptionist/doctors/${doctorId}/leave`,
    data
  );

  return response.data;
},

removeDoctorLeave: async (doctorId, date) => {
  const response = await api.delete(
    `/receptionist/doctors/${doctorId}/leave`,
    {
      params: {
        date: date,
      },
    }
  );

  return response.data;
},

};

export default receptionistService;