import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Search,
  UserRound,
  Stethoscope,
  CalendarDays,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  ChevronRight,
  RefreshCw,
  CalendarCheck,
  ClipboardList,
  X,
} from "lucide-react";

import receptionistService from "../../services/receptionistService";
import doctorService from "../../services/doctorService";

export default function ReceptionistBookAppointment() {
  const navigate = useNavigate();
  const location = useLocation();

  // =====================================================
  // STATE
  // =====================================================

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [selectedPatient, setSelectedPatient] =
    useState(() => location.state?.patient || null);

  const [selectedDoctorId, setSelectedDoctorId] =
    useState(
      location.state?.doctorId
        ? String(location.state.doctorId)
        : ""
    );

  const [selectedDate, setSelectedDate] =
    useState(
      location.state?.appointmentDate ||
        getToday()
    );

  const [selectedTime, setSelectedTime] =
    useState(
      location.state?.appointmentTime || ""
    );

  const [patientSearch, setPatientSearch] =
    useState("");

  const [reason, setReason] =
    useState("");

  const [gender, setGender] =
    useState("");

  const [dateOfBirth, setDateOfBirth] =
    useState("");

  const [phoneNumber, setPhoneNumber] =
    useState(location.state?.patient?.phoneNumber || "");

  const [slots, setSlots] = useState([]);

  const [loadingPatients, setLoadingPatients] =
    useState(false);

  const [loadingDoctors, setLoadingDoctors] =
    useState(false);

  const [loadingSlots, setLoadingSlots] =
    useState(false);

  const [booking, setBooking] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =====================================================
  // LOAD DOCTORS
  // =====================================================

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoadingDoctors(true);

      const data =
        await doctorService.getDoctors();

      setDoctors(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Doctor loading error:",
        err
      );

      setError(
        "Unable to load doctors."
      );
    } finally {
      setLoadingDoctors(false);
    }
  };

  // =====================================================
  // SEARCH PATIENTS
  // =====================================================

  useEffect(() => {
    const query = patientSearch.trim();

    // Do not call the backend for an empty/very short query.
    if (!query || query.length < 2 || selectedPatient) {
      setPatients([]);
      return;
    }

    const timer = setTimeout(() => {
      searchPatients(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [patientSearch, selectedPatient]);

  const searchPatients = async (query) => {
    try {
      setLoadingPatients(true);
      setError("");

      const data = await receptionistService.searchPatients(query);

      console.log("PATIENT SEARCH RESPONSE:", data);

      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("========== PATIENT SEARCH ERROR ==========");
      console.error("Status:", err?.response?.status);
      console.error("Response:", err?.response?.data);
      console.error("Request URL:", err?.config?.url);
      console.error("Request params:", err?.config?.params);
      console.error("Full error:", err);
      console.error("==========================================");

      setPatients([]);

      const data = err?.response?.data;

      let message =
        data?.message ||
        data?.error ||
        data?.detail ||
        (typeof data === "string" ? data : "") ||
        err?.message ||
        "Unable to search patients.";

      // Do not leave a generic error if the server returns an object.
      if (typeof data === "object" && data !== null && !message) {
        const values = Object.values(data)
          .filter((value) => typeof value === "string")
          .join(", ");

        if (values) message = values;
      }

      setError(String(message));
    } finally {
      setLoadingPatients(false);
    }
  };
  // =====================================================
  // LOAD AVAILABLE SLOTS
  // =====================================================

  useEffect(() => {
    if (
      selectedDoctorId &&
      selectedDate
    ) {
      loadSlots();
    } else {
      setSlots([]);
    }

    setSelectedTime("");
  }, [
    selectedDoctorId,
    selectedDate,
  ]);

  const loadSlots = async () => {
    try {
      setLoadingSlots(true);
      setError("");

      const data =
        await receptionistService.getAvailableSlots(
          Number(selectedDoctorId),
          selectedDate
        );

      setSlots(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Slot loading error:",
        err
      );

      setSlots([]);

      setError(
        "Unable to load available slots."
      );
    } finally {
      setLoadingSlots(false);
    }
  };

  // =====================================================
  // SELECT PATIENT
  // =====================================================

  const handlePatientSelect = (
    patient
  ) => {
    setSelectedPatient(patient);

    setPatientSearch(
      patient.name || ""
    );

    setPatients([]);

    setGender(
      patient.gender || ""
    );

    setDateOfBirth(
      patient.dateOfBirth || ""
    );

    setPhoneNumber(
      patient.phoneNumber || ""
    );

    setError("");
  };

  // =====================================================
  // SELECT DOCTOR
  // =====================================================

  const handleDoctorSelect = (
    doctorId
  ) => {
    setSelectedDoctorId(
      String(doctorId)
    );

    setSelectedTime("");
  };

  // =====================================================
  // SELECT SLOT
  // =====================================================

  const handleSlotSelect = (
    slot
  ) => {
    const time =
      typeof slot === "string"
        ? slot
        : slot?.startTime ||
          slot?.time ||
          slot?.appointmentTime;

    setSelectedTime(time);
  };

  // =====================================================
  // SELECTED DOCTOR
  // =====================================================

  const selectedDoctor =
    useMemo(() => {
      return doctors.find(
        (doctor) => {
          const id =
            doctor.id ??
            doctor.doctorId;

          return (
            String(id) ===
            String(selectedDoctorId)
          );
        }
      );
    }, [
      doctors,
      selectedDoctorId,
    ]);

  // =====================================================
  // BOOK APPOINTMENT
  // =====================================================

  const handleBooking = async (
    e
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedPatient) {
      setError(
        "Please select a patient."
      );
      return;
    }

    if (!selectedDoctorId) {
      setError(
        "Please select a doctor."
      );
      return;
    }

    if (!selectedDate) {
      setError(
        "Please select an appointment date."
      );
      return;
    }

    if (!selectedTime) {
      setError(
        "Please select an available time slot."
      );
      return;
    }

    if (!dateOfBirth) {
      setError(
        "Patient date of birth is required."
      );
      return;
    }

    if (!gender) {
      setError(
        "Patient gender is required."
      );
      return;
    }

    if (!phoneNumber) {
      setError(
        "Patient phone number is required."
      );
      return;
    }

    const patientId = selectedPatient.id ?? selectedPatient.patientId;
    if (!patientId) {
      setError("Selected patient does not have a valid patient ID.");
      return;
    }

    const normalizeTime = (value) => {
      const time = String(value || "").trim();
      const m = time.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
      if (!m) return time;
      let hour = Number(m[1]);
      const minute = m[2];
      const second = m[3] || "00";
      const period = m[4]?.toUpperCase();
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;
      return `${String(hour).padStart(2, "0")}:${minute}:${second}`;
    };

    try {
      setBooking(true);

      const requestData = {
        dateOfBirth,
        gender: gender.trim(),
        phoneNumber: phoneNumber.trim(),
        doctorId: Number(selectedDoctorId),
        appointmentDate: selectedDate,
        appointmentTime: normalizeTime(selectedTime),
        reason: reason.trim() || null,
      };

      console.log("BOOKING REQUEST", { patientId, ...requestData });

      await receptionistService.bookAppointment(
        Number(patientId),
        requestData
      );

      setSuccess(
        "Appointment booked successfully."
      );

      setTimeout(() => {
        navigate(
          "/receptionist/appointments"
        );
      }, 1200);
    } catch (err) {
      console.error(
        "Booking error:",
        err
      );

      console.error("Booking status:", err?.response?.status);
      console.error("Booking response:", err?.response?.data);
      console.error("Booking request:", err?.config?.data);

      const data = err?.response?.data;
      const message =
        data?.message ||
        data?.error ||
        data?.detail ||
        (typeof data === "string" ? data : "") ||
        err?.message ||
        "Unable to book appointment.";

      setError(String(message));
    } finally {
      setBooking(false);
    }
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) return "-";

    const parts =
      String(time).split(":");

    const hour =
      Number(parts[0]);

    const minute =
      Number(parts[1] || 0);

    if (Number.isNaN(hour)) {
      return time;
    }

    const date = new Date();

    date.setHours(
      hour,
      minute,
      0,
      0
    );

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f5f9fd] text-[#10264a]">

      {/* HEADER */}

      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="px-5 lg:px-8 py-4">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <button
                onClick={() =>
                  navigate(
                    "/receptionist/dashboard"
                  )
                }
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center"
              >
                <ArrowLeft
                  size={20}
                />
              </button>

              <div>
                <h1 className="text-xl lg:text-2xl font-bold">
                  Book Appointment
                </h1>

                <p className="text-sm text-slate-500">
                  Schedule a patient appointment
                </p>
              </div>

            </div>

            <div className="hidden md:flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-semibold">
              <CalendarCheck
                size={18}
              />

              Appointment Desk
            </div>

          </div>

        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-4 lg:p-7">

        {/* HERO */}

        <section className="bg-gradient-to-r from-[#e7f3ff] to-[#dff0ff] border border-blue-100 rounded-2xl p-6 mb-6">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>

              <span className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                <CalendarCheck
                  size={14}
                />

                APPOINTMENT BOOKING
              </span>

              <h2 className="text-2xl lg:text-3xl font-bold mt-3">
                Schedule a new appointment
              </h2>

              <p className="text-slate-500 mt-2 text-sm">
                Select a patient, doctor,
                date and available time slot.
              </p>

            </div>

            <div className="hidden lg:flex w-28 h-28 rounded-full bg-blue-100 items-center justify-center">
              <CalendarDays
                size={52}
                className="text-blue-600"
              />
            </div>

          </div>

        </section>

        {/* SUCCESS */}

        {success && (
          <div className="mb-5 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4 flex items-center gap-3 text-emerald-700">

            <CheckCircle2
              size={22}
            />

            <div>
              <p className="font-bold">
                Appointment Confirmed
              </p>

              <p className="text-sm">
                {success}
              </p>
            </div>

          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-center gap-3 text-red-700">

            <AlertCircle
              size={22}
            />

            <div className="flex-1">
              <p className="font-bold">
                Booking Error
              </p>

              <p className="text-sm">
                {error}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {patientSearch.trim().length >= 2 && !selectedPatient && (
                <button
                  type="button"
                  onClick={() => searchPatients(patientSearch.trim())}
                  className="text-xs font-semibold px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200"
                >
                  Retry
                </button>
              )}

              <button
                type="button"
                onClick={() => setError("")}
              >
                <X size={18} />
              </button>
            </div>

          </div>
        )}

        <form
          onSubmit={handleBooking}
        >

          <div className="grid xl:grid-cols-[1fr_370px] gap-6">

            {/* LEFT */}

            <div className="space-y-5">

              {/* STEP 1 */}

              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                <SectionHeader
                  number="1"
                  icon={
                    <UserRound
                      size={20}
                    />
                  }
                  title="Select Patient"
                  description="Search and select the patient for this appointment"
                />

                <div className="p-5 lg:p-6">

                  {selectedPatient ? (
                    <div className="border border-blue-200 bg-blue-50 rounded-xl p-4">

                      <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                          {selectedPatient.name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="flex-1">

                          <h3 className="font-bold">
                            {
                              selectedPatient.name
                            }
                          </h3>

                          <p className="text-xs text-slate-500 mt-1">
                            Patient ID: P-
                            {String(
                              selectedPatient.id ?? selectedPatient.patientId
                            ).padStart(
                              5,
                              "0"
                            )}
                          </p>

                          <div className="flex flex-wrap gap-3 mt-2">

                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Phone
                                size={13}
                              />

                              {
                                selectedPatient.phoneNumber
                              }
                            </span>

                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Mail
                                size={13}
                              />

                              {
                                selectedPatient.email
                              }
                            </span>

                          </div>

                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPatient(
                              null
                            );

                            setPatientSearch(
                              ""
                            );

                            setPatients([]);
                          }}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X
                            size={19}
                          />
                        </button>

                      </div>

                    </div>
                  ) : (
                    <>
                      <div className="relative">

                        <Search
                          size={20}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          value={
                            patientSearch
                          }
                          onChange={(e) =>
                            setPatientSearch(
                              e.target.value
                            )
                          }
                          placeholder="Type at least 2 characters: name, phone or email..."
                          className="w-full h-12 pl-12 pr-4 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {loadingPatients && (
                          <RefreshCw
                            size={18}
                            className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-blue-600"
                          />
                        )}

                      </div>

                      {patients.length >
                        0 && (
                        <div className="mt-3 border border-slate-200 rounded-xl overflow-hidden">

                          {patients
                            .slice(
                              0,
                              5
                            )
                            .map(
                              (
                                patient
                              ) => (
                                <button
                                  type="button"
                                  key={
                                    patient.id
                                  }
                                  onClick={() =>
                                    handlePatientSelect(
                                      patient
                                    )
                                  }
                                  className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 border-b last:border-0 border-slate-100 text-left"
                                >

                                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                    {patient.name
                                      ?.charAt(
                                        0
                                      )
                                      .toUpperCase()}
                                  </div>

                                  <div className="flex-1">

                                    <p className="font-semibold text-sm">
                                      {
                                        patient.name
                                      }
                                    </p>

                                    <p className="text-xs text-slate-400">
                                      P-
                                      {String(
                                        patient.id
                                      ).padStart(
                                        5,
                                        "0"
                                      )}{" "}
                                      •{" "}
                                      {
                                        patient.phoneNumber
                                      }
                                    </p>

                                  </div>

                                  <ChevronRight
                                    size={
                                      17
                                    }
                                    className="text-slate-400"
                                  />

                                </button>
                              )
                            )}

                        </div>
                      )}

                    </>
                  )}

                </div>

              </section>

              {/* PATIENT INFORMATION */}

              {selectedPatient && (
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 lg:p-6">

                  <div className="flex items-center gap-3 mb-5">

                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <ClipboardList
                        size={20}
                      />
                    </div>

                    <div>
                      <h3 className="font-bold">
                        Patient Information
                      </h3>

                      <p className="text-xs text-slate-400">
                        Verify information before booking
                      </p>
                    </div>

                  </div>

                  <div className="grid md:grid-cols-3 gap-4">

                    <Field
                      label="Date of Birth"
                      type="date"
                      value={
                        dateOfBirth
                      }
                      onChange={(e) =>
                        setDateOfBirth(
                          e.target.value
                        )
                      }
                    />

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-2">
                        Gender
                      </label>

                      <select
                        value={gender}
                        onChange={(e) =>
                          setGender(
                            e.target.value
                          )
                        }
                        className="w-full h-11 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">
                          Select Gender
                        </option>

                        <option value="Male">
                          Male
                        </option>

                        <option value="Female">
                          Female
                        </option>

                        <option value="Other">
                          Other
                        </option>
                      </select>
                    </div>

                    <Field
                      label="Phone Number"
                      value={
                        phoneNumber
                      }
                      onChange={(e) =>
                        setPhoneNumber(
                          e.target.value
                        )
                      }
                      placeholder="Phone number"
                    />

                  </div>

                </section>
              )}

              {/* STEP 2 */}

              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                <SectionHeader
                  number="2"
                  icon={
                    <Stethoscope
                      size={20}
                    />
                  }
                  title="Select Doctor"
                  description="Choose the doctor for the appointment"
                />

                <div className="p-5 lg:p-6">

                  {loadingDoctors ? (
                    <div className="py-10 text-center text-slate-400">
                      <RefreshCw
                        size={25}
                        className="animate-spin mx-auto mb-2"
                      />

                      Loading doctors...
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-3">

                      {doctors.map(
                        (doctor) => {
                          const doctorId =
                            doctor.id ??
                            doctor.doctorId;

                          const name =
                            doctor.name ||
                            doctor.doctorName ||
                            "Doctor";

                          const specialization =
                            doctor.specialization ||
                            "General";

                          const selected =
                            String(
                              doctorId
                            ) ===
                            String(
                              selectedDoctorId
                            );

                          return (
                            <button
                              type="button"
                              key={
                                doctorId
                              }
                              onClick={() =>
                                handleDoctorSelect(
                                  doctorId
                                )
                              }
                              className={`text-left p-4 rounded-xl border transition ${
                                selected
                                  ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                                  : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                              }`}
                            >

                              <div className="flex items-center gap-3">

                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                                    selected
                                      ? "bg-blue-600 text-white"
                                      : "bg-blue-100 text-blue-600"
                                  }`}
                                >
                                  {name
                                    .charAt(
                                      0
                                    )
                                    .toUpperCase()}
                                </div>

                                <div className="flex-1">

                                  <p className="font-bold text-sm">
                                    {name}
                                  </p>

                                  <p className="text-xs text-slate-500 mt-1">
                                    {
                                      specialization
                                    }
                                  </p>

                                </div>

                                {selected && (
                                  <CheckCircle2
                                    size={
                                      20
                                    }
                                    className="text-blue-600"
                                  />
                                )}

                              </div>

                            </button>
                          );
                        }
                      )}

                    </div>
                  )}

                </div>

              </section>

              {/* STEP 3 */}

              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                <SectionHeader
                  number="3"
                  icon={
                    <CalendarDays
                      size={20}
                    />
                  }
                  title="Select Date & Time"
                  description="Choose an available appointment slot"
                />

                <div className="p-5 lg:p-6">

                  {/* DATE */}

                  <div className="max-w-sm mb-6">

                    <label className="block text-xs font-semibold text-slate-500 mb-2">
                      Appointment Date
                    </label>

                    <div className="relative">

                      <CalendarDays
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
                      />

                      <input
                        type="date"
                        value={
                          selectedDate
                        }
                        min={getToday()}
                        onChange={(e) =>
                          setSelectedDate(
                            e.target.value
                          )
                        }
                        className="w-full h-11 pl-10 pr-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      />

                    </div>

                  </div>

                  {/* SLOTS */}

                  {!selectedDoctorId ? (
                    <EmptyState
                      icon={
                        <Stethoscope
                          size={30}
                        />
                      }
                      title="Select a doctor first"
                      description="Available appointment slots will appear here."
                    />
                  ) : loadingSlots ? (
                    <div className="py-12 text-center text-slate-400">

                      <RefreshCw
                        size={28}
                        className="animate-spin mx-auto mb-3 text-blue-600"
                      />

                      Loading available slots...

                    </div>
                  ) : slots.length ===
                    0 ? (
                    <EmptyState
                      icon={
                        <Clock3
                          size={30}
                        />
                      }
                      title="No available slots"
                      description="Try selecting another date."
                    />
                  ) : (
                    <div>

                      <div className="flex items-center justify-between mb-3">

                        <div>
                          <p className="font-bold text-sm">
                            Available Slots
                          </p>

                          <p className="text-xs text-slate-400">
                            {formatDate(
                              selectedDate
                            )}
                          </p>
                        </div>

                        <span className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full font-semibold">
                          {
                            slots.length
                          }{" "}
                          available
                        </span>

                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">

                        {slots.map(
                          (
                            slot,
                            index
                          ) => {
                            const time =
                              typeof slot ===
                              "string"
                                ? slot
                                : slot?.startTime ||
                                  slot?.time ||
                                  slot?.appointmentTime;

                            const selected =
                              String(
                                selectedTime
                              ) ===
                              String(
                                time
                              );

                            return (
                              <button
                                type="button"
                                key={`${time}-${index}`}
                                onClick={() =>
                                  handleSlotSelect(
                                    slot
                                  )
                                }
                                className={`p-3 rounded-xl border font-semibold text-sm transition flex items-center justify-center gap-2 ${
                                  selected
                                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                    : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                }`}
                              >
                                <Clock3
                                  size={
                                    16
                                  }
                                />

                                {formatTime(
                                  time
                                )}

                              </button>
                            );
                          }
                        )}

                      </div>

                    </div>
                  )}

                </div>

              </section>

              {/* REASON */}

              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 lg:p-6">

                <label className="block text-sm font-bold mb-2">
                  Reason for Visit
                  <span className="text-slate-400 font-normal">
                    {" "}
                    (Optional)
                  </span>
                </label>

                <textarea
                  value={reason}
                  onChange={(e) =>
                    setReason(
                      e.target.value
                    )
                  }
                  rows="4"
                  placeholder="Enter patient's reason for visit..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />

              </section>

            </div>

            {/* RIGHT SUMMARY */}

            <aside>

              <div className="sticky top-[95px] space-y-5">

                {/* SUMMARY */}

                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                  <div className="bg-[#10264a] text-white p-5">

                    <div className="flex items-center gap-3">

                      <CalendarCheck
                        size={22}
                      />

                      <div>

                        <h3 className="font-bold">
                          Appointment Summary
                        </h3>

                        <p className="text-xs text-blue-200 mt-1">
                          Review before booking
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="p-5 space-y-5">

                    <SummaryRow
                      icon={
                        <UserRound
                          size={18}
                        />
                      }
                      label="Patient"
                      value={
                        selectedPatient?.name ||
                        "Not selected"
                      }
                    />

                    <SummaryRow
                      icon={
                        <Stethoscope
                          size={18}
                        />
                      }
                      label="Doctor"
                      value={
                        selectedDoctor?.name ||
                        selectedDoctor?.doctorName ||
                        "Not selected"
                      }
                    />

                    <SummaryRow
                      icon={
                        <CalendarDays
                          size={18}
                        />
                      }
                      label="Date"
                      value={
                        selectedDate
                          ? formatDate(
                              selectedDate
                            )
                          : "Not selected"
                      }
                    />

                    <SummaryRow
                      icon={
                        <Clock3
                          size={18}
                        />
                      }
                      label="Time"
                      value={
                        selectedTime
                          ? formatTime(
                              selectedTime
                            )
                          : "Not selected"
                      }
                    />

                    <div className="border-t border-slate-100 pt-5">

                      <div className="bg-blue-50 rounded-xl p-4">

                        <p className="text-xs text-blue-600 font-semibold">
                          Appointment Status
                        </p>

                        <div className="flex items-center gap-2 mt-2">

                          <span className="w-2.5 h-2.5 bg-orange-400 rounded-full" />

                          <span className="font-bold text-sm">
                            Ready to Book
                          </span>

                        </div>

                      </div>

                    </div>

                    <button
                      type="submit"
                      disabled={
                        booking ||
                        !selectedPatient ||
                        !selectedDoctorId ||
                        !selectedDate ||
                        !selectedTime
                      }
                      className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold flex items-center justify-center gap-2 transition"
                    >
                      {booking ? (
                        <>
                          <RefreshCw
                            size={18}
                            className="animate-spin"
                          />

                          Booking...
                        </>
                      ) : (
                        <>
                          <CalendarCheck
                            size={19}
                          />

                          Confirm Appointment
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-center text-slate-400">
                      The appointment will be
                      created with BOOKED status.
                    </p>

                  </div>

                </section>

                {/* HELP */}

                <section className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5">

                  <h3 className="font-bold text-sm">
                    Booking Steps
                  </h3>

                  <div className="mt-4 space-y-3">

                    <MiniStep
                      number="1"
                      text="Search and select patient"
                      done={
                        !!selectedPatient
                      }
                    />

                    <MiniStep
                      number="2"
                      text="Choose doctor"
                      done={
                        !!selectedDoctorId
                      }
                    />

                    <MiniStep
                      number="3"
                      text="Select date and slot"
                      done={
                        !!selectedTime
                      }
                    />

                    <MiniStep
                      number="4"
                      text="Confirm appointment"
                      done={false}
                    />

                  </div>

                </section>

              </div>

            </aside>

          </div>

        </form>

      </main>
    </div>
  );
}

// =======================================================
// SECTION HEADER
// =======================================================

function SectionHeader({
  number,
  icon,
  title,
  description,
}) {
  return (
    <div className="px-5 lg:px-6 py-4 border-b border-slate-100 flex items-center gap-3">

      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
        {number}
      </div>

      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
        {icon}
      </div>

      <div>
        <h3 className="font-bold">
          {title}
        </h3>

        <p className="text-xs text-slate-400">
          {description}
        </p>
      </div>

    </div>
  );
}

// =======================================================
// FIELD
// =======================================================

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>

      <label className="block text-xs font-semibold text-slate-500 mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-11 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />

    </div>
  );
}

// =======================================================
// SUMMARY ROW
// =======================================================

function SummaryRow({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
          {label}
        </p>

        <p className="text-sm font-bold mt-0.5 truncate">
          {value}
        </p>

      </div>

    </div>
  );
}

// =======================================================
// EMPTY STATE
// =======================================================

function EmptyState({
  icon,
  title,
  description,
}) {
  return (
    <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl">

      <div className="w-14 h-14 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-3">
        {icon}
      </div>

      <p className="font-bold text-slate-600">
        {title}
      </p>

      <p className="text-xs text-slate-400 mt-1">
        {description}
      </p>

    </div>
  );
}

// =======================================================
// MINI STEP
// =======================================================

function MiniStep({
  number,
  text,
  done,
}) {
  return (
    <div className="flex items-center gap-3">

      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
          done
            ? "bg-emerald-500 text-white"
            : "bg-white text-slate-500 border border-slate-200"
        }`}
      >
        {done ? (
          <CheckCircle2
            size={16}
          />
        ) : (
          number
        )}
      </div>

      <span
        className={`text-xs ${
          done
            ? "text-slate-700 font-semibold"
            : "text-slate-400"
        }`}
      >
        {text}
      </span>

    </div>
  );
}

// =======================================================
// TODAY
// =======================================================

function getToday() {
  const date = new Date();

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}