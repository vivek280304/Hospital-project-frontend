import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  ArrowLeft,
  RefreshCw,
  Search,
  UserRound,
  Power,
} from "lucide-react";

import receptionistService from "../../services/receptionistService";
import doctorService from "../../services/doctorService";

export default function ReceptionistDoctorSlots() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDate, setSelectedDate] = useState(getToday());

  const [slots, setSlots] = useState([]);
  const [schedule, setSchedule] = useState([]);

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [loadingLeave, setLoadingLeave] = useState(false);
  const [leaveLoaded, setLeaveLoaded] = useState(false);

  const [doctorOnLeave, setDoctorOnLeave] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Prevent older async requests from overwriting newer state.
  const requestRef = useRef(0);

  // =====================================================
  // LOAD DOCTORS
  // =====================================================

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoadingDoctors(true);
      setError("");

      const data = await doctorService.getDoctors();
      const list = Array.isArray(data) ? data : [];

      setDoctors(list);

      if (list.length > 0 && !selectedDoctorId) {
        const id = list[0]?.id ?? list[0]?.doctorId;

        if (id != null) {
          setSelectedDoctorId(String(id));
        }
      }
    } catch (err) {
      console.error("Failed to load doctors:", err);
      setDoctors([]);
      setError(getErrorMessage(err, "Unable to load doctors."));
    } finally {
      setLoadingDoctors(false);
    }
  };

  // =====================================================
  // LOAD DATA WHEN DOCTOR / DATE CHANGES
  // IMPORTANT: leave is checked FIRST, then slots.
  // =====================================================

  useEffect(() => {
    if (!selectedDoctorId || !selectedDate) {
      setSlots([]);
      setSchedule([]);
      setDoctorOnLeave(false);
      return;
    }

    loadPageData();
  }, [selectedDoctorId, selectedDate]);

  const loadPageData = async () => {
    const requestId = ++requestRef.current;

    setError("");

    // Schedule is independent of the selected date.
    loadSchedule();

    // Leave must be checked before displaying slots.
    const onLeave = await fetchDoctorLeave(requestId);

    // Ignore an old request if doctor/date changed while waiting.
    if (requestId !== requestRef.current) {
      return;
    }

    if (onLeave) {
      setSlots([]);
      return;
    }

    await loadSlots(requestId);
  };

  // =====================================================
  // LOAD LEAVE STATUS
  // Returns true/false from backend.
  // =====================================================

  const fetchDoctorLeave = async (requestId = requestRef.current) => {
    if (!selectedDoctorId || !selectedDate) {
      setDoctorOnLeave(false);
      setLeaveLoaded(true);
      return false;
    }

    setLeaveLoaded(false);
    setLoadingLeave(true);

    try {
      const data = await receptionistService.getDoctorLeaves(
        Number(selectedDoctorId)
      );

      console.log("Doctor leaves API response:", data);

      const leaves = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.leaves)
        ? data.leaves
        : [];

      if (requestId !== requestRef.current) {
        return false;
      }

      const onLeave = leaves.some((leave) => {
        const leaveDoctorId =
          leave?.doctorId ??
          leave?.doctor_id ??
          leave?.doctor?.id;

        const rawDate =
          leave?.leaveDate ??
          leave?.leave_date ??
          leave?.date;

        const leaveDate = normalizeDate(rawDate);
        const selected = normalizeDate(selectedDate);

        const doctorMatches =
          leaveDoctorId == null ||
          String(leaveDoctorId) === String(selectedDoctorId);

        return doctorMatches && leaveDate === selected;
      });

      console.log("Leave status:", {
        doctorId: selectedDoctorId,
        date: selectedDate,
        onLeave,
      });

      setDoctorOnLeave(onLeave);
      setLeaveLoaded(true);

      return onLeave;
    } catch (err) {
      console.error("Failed to check doctor leave:", err);

      // Never silently show Turn OFF when leave status could not be read.
      setDoctorOnLeave(false);
      setLeaveLoaded(false);
      setSlots([]);
      setError(
        getErrorMessage(
          err,
          "Unable to check doctor availability. Please refresh and try again."
        )
      );

      return false;
    } finally {
      setLoadingLeave(false);
    }
  };

  // =====================================================
  // LOAD AVAILABLE SLOTS
  // =====================================================

  const loadSlots = async (requestId = requestRef.current) => {
    if (!selectedDoctorId || !selectedDate) {
      setSlots([]);
      return;
    }

    try {
      setLoadingSlots(true);

      const data = await receptionistService.getAvailableSlots(
        Number(selectedDoctorId),
        selectedDate
      );

      if (requestId !== requestRef.current) {
        return;
      }

      // Normally the API returns an array.
      // Keep this tolerant in case the service returns { slots: [] }.
      const result = Array.isArray(data)
        ? data
        : Array.isArray(data?.slots)
        ? data.slots
        : [];

      setSlots(result);
    } catch (err) {
      if (requestId === requestRef.current) {
        console.error("Failed to load available slots:", err);
        setSlots([]);
        setError(
          getErrorMessage(
            err,
            "Unable to load available slots."
          )
        );
      }
    } finally {
      if (requestId === requestRef.current) {
        setLoadingSlots(false);
      }
    }
  };

  // =====================================================
  // LOAD DOCTOR SCHEDULE
  // =====================================================

  const loadSchedule = async () => {
    if (!selectedDoctorId) {
      setSchedule([]);
      return;
    }

    try {
      setLoadingSchedule(true);

      const data = await receptionistService.getDoctorSchedule(
        Number(selectedDoctorId)
      );

      setSchedule(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load doctor schedule:", err);
      setSchedule([]);
    } finally {
      setLoadingSchedule(false);
    }
  };

  // =====================================================
  // TURN DOCTOR ON / OFF
  // =====================================================

  const toggleDoctorAvailability = async () => {
    if (!selectedDoctorId || !selectedDate || !leaveLoaded) {
      return;
    }

    const doctorId = Number(selectedDoctorId);
    const wasOnLeave = doctorOnLeave;

    try {
      setLoadingLeave(true);
      setError("");

      if (wasOnLeave) {
        // =========================
        // TURN ON
        // =========================
        await receptionistService.removeDoctorLeave(
          doctorId,
          selectedDate
        );

        // DELETE succeeded. Doctor is now ON.
        setDoctorOnLeave(false);
        setLeaveLoaded(true);

        // Refresh slots for the now-available doctor.
        await loadSlots();
      } else {
        // =========================
        // TURN OFF
        // =========================
        await receptionistService.createDoctorLeave(
          doctorId,
          {
            leaveDate: selectedDate,
            reason: "Doctor unavailable",
          }
        );

        // POST succeeded. Doctor is now OFF.
        setDoctorOnLeave(true);
        setLeaveLoaded(true);
        setSlots([]);
      }
    } catch (err) {
      console.error("Failed to update doctor availability:", err);

      const message = getErrorMessage(
        err,
        "Unable to update doctor availability."
      );

      // Backend says the leave already exists.
      // Treat that as OFF instead of trying POST again.
      if (message.toLowerCase().includes("already has leave")) {
        setDoctorOnLeave(true);
        setLeaveLoaded(true);
        setSlots([]);
        setError("");
        return;
      }

      setError(message);

      // Re-check only after an actual request failure.
      await fetchDoctorLeave();
    } finally {
      setLoadingLeave(false);
    }
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {
    if (!selectedDoctorId || !selectedDate) {
      await loadDoctors();
      return;
    }

    setError("");

    // First ask backend whether leave exists.
    const onLeave = await fetchDoctorLeave();

    // Then decide whether slots should be loaded.
    if (onLeave) {
      setSlots([]);
    } else {
      await loadSlots();
    }

    await loadSchedule();
  };

  // =====================================================
  // SELECTED DOCTOR
  // =====================================================

  const selectedDoctor = doctors.find((doctor) => {
    const id = doctor?.id ?? doctor?.doctorId;
    return String(id) === String(selectedDoctorId);
  });

  // =====================================================
  // FILTER DOCTORS
  // =====================================================

  const filteredDoctors = doctors.filter((doctor) => {
    const name = doctor?.name || doctor?.doctorName || "";
    const specialization = doctor?.specialization || "";

    return `${name} ${specialization}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  // =====================================================
  // BOOK APPOINTMENT
  // =====================================================

  const handleSlotClick = (slot) => {
    if (doctorOnLeave) {
      setError("Doctor is unavailable on this date.");
      return;
    }

    const time =
      typeof slot === "string"
        ? slot
        : slot?.startTime ||
          slot?.time ||
          slot?.appointmentTime;

    if (!time) {
      setError("Invalid appointment time.");
      return;
    }

    navigate("/receptionist/appointments/book", {
      state: {
        doctorId: Number(selectedDoctorId),
        appointmentDate: selectedDate,
        appointmentTime: time,
      },
    });
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f5f9fd]">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                navigate("/receptionist/dashboard")
              }
              className="p-2 rounded-lg hover:bg-slate-100 transition"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-[#10264a]">
                Doctor Available Slots
              </h1>

              <p className="text-sm text-slate-500">
                Check doctor schedules and available appointment slots
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={
              loadingDoctors ||
              loadingSlots ||
              loadingLeave
            }
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={
                loadingDoctors ||
                loadingSlots ||
                loadingLeave
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-6">
        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-[320px_1fr] gap-5">
          {/* =================================================
              DOCTOR LIST
          ================================================= */}

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="font-bold text-lg text-[#10264a]">
                Select Doctor
              </h2>

              <div className="relative mt-4">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search doctor..."
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-3 max-h-[600px] overflow-y-auto">
              {loadingDoctors ? (
                <div className="text-center py-10 text-slate-400">
                  Loading doctors...
                </div>
              ) : filteredDoctors.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  No doctors found.
                </div>
              ) : (
                filteredDoctors.map((doctor) => {
                  const doctorId =
                    doctor?.id ?? doctor?.doctorId;

                  const doctorName =
                    doctor?.name ||
                    doctor?.doctorName ||
                    "Doctor";

                  const specialization =
                    doctor?.specialization ||
                    "General";

                  const selected =
                    String(doctorId) ===
                    String(selectedDoctorId);

                  return (
                    <button
                      type="button"
                      key={doctorId}
                      onClick={() =>
                        setSelectedDoctorId(
                          String(doctorId)
                        )
                      }
                      className={`w-full text-left p-3 rounded-xl mb-2 flex items-center gap-3 transition ${
                        selected
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-slate-50 border border-transparent"
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center font-bold ${
                          selected
                            ? "bg-blue-600 text-white"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {doctorName
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {doctorName}
                        </p>

                        <p className="text-xs text-slate-500 truncate">
                          {specialization}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          {/* =================================================
              SLOT AREA
          ================================================= */}

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            {/* DOCTOR HEADER */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <UserRound size={28} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#10264a]">
                    {selectedDoctor?.name ||
                      selectedDoctor?.doctorName ||
                      "Select Doctor"}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {selectedDoctor?.specialization ||
                      "Doctor"}
                  </p>
                </div>
              </div>

              {/* DATE + ON/OFF */}

              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">
                    Select Date
                  </label>

                  <input
                    type="date"
                    value={selectedDate}
                    min={getToday()}
                    onChange={(e) =>
                      setSelectedDate(e.target.value)
                    }
                    className="border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={toggleDoctorAvailability}
                  disabled={
                    loadingLeave ||
                    !leaveLoaded ||
                    !selectedDoctorId ||
                    !selectedDate
                  }
                  className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition border ${
                    doctorOnLeave
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <Power size={17} />

                  {loadingLeave
                    ? "Updating..."
                    : !leaveLoaded
                    ? "Checking..."
                    : doctorOnLeave
                    ? "Turn ON"
                    : "Turn OFF"}
                </button>
              </div>
            </div>

            {/* STATUS */}

            <div className="mt-5">
              {doctorOnLeave ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                  <div className="w-3 h-3 rounded-full bg-red-500" />

                  <div>
                    <p className="font-semibold text-red-700">
                      Doctor is OFF
                    </p>

                    <p className="text-sm text-red-600">
                      Doctor is unavailable on{" "}
                      {formatDate(selectedDate)}.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />

                  <div>
                    <p className="font-semibold text-emerald-700">
                      Doctor is ON
                    </p>

                    <p className="text-sm text-emerald-600">
                      Doctor is available according to the schedule.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* AVAILABLE SLOTS */}

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">
                    Available Time Slots
                  </h3>

                  <p className="text-xs text-slate-400">
                    {formatDate(selectedDate)}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded bg-emerald-400" />
                  Available
                </div>
              </div>

              {loadingSlots ? (
                <div className="py-16 text-center text-slate-400">
                  <RefreshCw
                    size={25}
                    className="animate-spin mx-auto mb-3"
                  />

                  Loading available slots...
                </div>
              ) : slots.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-slate-200 rounded-xl">
                  <Clock3
                    size={40}
                    className="mx-auto text-slate-300 mb-3"
                  />

                  <p className="font-semibold text-slate-600">
                    {doctorOnLeave
                      ? "Doctor is OFF on this date"
                      : "No available slots"}
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    {doctorOnLeave
                      ? "Turn the doctor ON to make appointments available."
                      : "Try another date or doctor."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {slots.map((slot, index) => {
                    const time =
                      typeof slot === "string"
                        ? slot
                        : slot?.startTime ||
                          slot?.time ||
                          slot?.appointmentTime;

                    return (
                      <button
                        type="button"
                        key={`${time}-${index}`}
                        onClick={() =>
                          handleSlotClick(slot)
                        }
                        disabled={doctorOnLeave}
                        className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-emerald-700 font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Clock3
                          size={17}
                          className="mx-auto mb-2"
                        />

                        {formatTime(time)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* DOCTOR SCHEDULE */}

            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays
                  size={20}
                  className="text-blue-600"
                />

                <h3 className="font-bold">
                  Doctor Schedule
                </h3>
              </div>

              {loadingSchedule ? (
                <p className="text-sm text-slate-400">
                  Loading schedule...
                </p>
              ) : schedule.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No schedule available.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {schedule.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <p className="font-semibold text-sm">
                        {item?.dayOfWeek ||
                          item?.day ||
                          "Day"}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {formatTime(item?.startTime)} -{" "}
                        {formatTime(item?.endTime)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// =====================================================
// HELPERS
// =====================================================

function getToday() {
  const date = new Date();

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function normalizeDate(value) {
  if (value == null) {
    return "";
  }

  // Jackson can serialize LocalDate as [2026, 10, 19].
  if (Array.isArray(value)) {
    if (value.length >= 3) {
      return `${String(value[0]).padStart(4, "0")}-${String(
        value[1]
      ).padStart(2, "0")}-${String(value[2]).padStart(2, "0")}`;
    }
    return "";
  }

  const text = String(value).trim();

  // ISO date/time: 2026-10-19T00:00:00
  if (text.includes("T")) {
    return text.split("T")[0];
  }

  // Normal LocalDate: 2026-10-19
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  return text.substring(0, 10);
}

function formatDate(date) {
  if (!date) {
    return "";
  }

  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTime(time) {
  if (!time) {
    return "-";
  }

  const parts = String(time).split(":");

  const hour = Number(parts[0]);
  const minute = Number(parts[1] || 0);

  if (Number.isNaN(hour)) {
    return time;
  }

  const date = new Date();

  date.setHours(hour, minute, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    (typeof error?.response?.data === "string"
      ? error.response.data
      : null) ||
    fallback
  );
}