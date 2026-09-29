import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  ArrowLeft,
  RefreshCw,
  Search,
  UserRound,
  CalendarCheck,
} from "lucide-react";

import receptionistService from "../../services/receptionistService";
import doctorService from "../../services/doctorService";

export default function ReceptionistDoctorSlots() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] =
    useState("");

  const [selectedDate, setSelectedDate] =
    useState(getToday());

  const [slots, setSlots] = useState([]);

  const [schedule, setSchedule] =
    useState([]);

  const [loadingDoctors, setLoadingDoctors] =
    useState(true);

  const [loadingSlots, setLoadingSlots] =
    useState(false);

  const [loadingSchedule, setLoadingSchedule] =
    useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

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

      const data =
        await doctorService.getDoctors();

      const doctorList =
        Array.isArray(data) ? data : [];

      setDoctors(doctorList);

      if (
        doctorList.length > 0 &&
        !selectedDoctorId
      ) {
        const firstDoctor =
          doctorList[0];

        const id =
          firstDoctor.id ??
          firstDoctor.doctorId;

        if (id != null) {
          setSelectedDoctorId(
            String(id)
          );
        }
      }
    } catch (err) {
      console.error(
        "Failed to load doctors:",
        err
      );

      setDoctors([]);

      setError(
        "Unable to load doctors."
      );
    } finally {
      setLoadingDoctors(false);
    }
  };

  // =====================================================
  // LOAD SLOTS
  // =====================================================

  useEffect(() => {
    if (
      selectedDoctorId &&
      selectedDate
    ) {
      loadSlots();
      loadSchedule();
    }
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
        "Failed to load available slots:",
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
  // LOAD DOCTOR SCHEDULE
  // =====================================================

  const loadSchedule = async () => {
    try {
      setLoadingSchedule(true);

      const data =
        await receptionistService.getDoctorSchedule(
          Number(selectedDoctorId)
        );

      setSchedule(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load doctor schedule:",
        err
      );

      setSchedule([]);
    } finally {
      setLoadingSchedule(false);
    }
  };

  // =====================================================
  // SELECTED DOCTOR
  // =====================================================

  const selectedDoctor =
    doctors.find((doctor) => {
      const id =
        doctor.id ??
        doctor.doctorId;

      return (
        String(id) ===
        String(selectedDoctorId)
      );
    });

  // =====================================================
  // FILTER DOCTORS
  // =====================================================

  const filteredDoctors =
    doctors.filter((doctor) => {
      const name =
        doctor.name ||
        doctor.doctorName ||
        "";

      const specialization =
        doctor.specialization ||
        "";

      const text =
        `${name} ${specialization}`
          .toLowerCase();

      return text.includes(
        search.toLowerCase()
      );
    });

  // =====================================================
  // BOOK APPOINTMENT
  // =====================================================

  const handleSlotClick = (slot) => {
    const time =
      typeof slot === "string"
        ? slot
        : slot?.startTime ||
          slot?.time ||
          slot?.appointmentTime;

    navigate(
      "/receptionist/appointments/book",
      {
        state: {
          doctorId:
            Number(selectedDoctorId),

          appointmentDate:
            selectedDate,

          appointmentTime:
            time,
        },
      }
    );
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
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f5f9fd]">
      {/* HEADER */}

      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                navigate(
                  "/receptionist/dashboard"
                )
              }
              className="p-2 rounded-lg hover:bg-slate-100"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-[#10264a]">
                Doctor Available Slots
              </h1>

              <p className="text-sm text-slate-500">
                Check doctor schedules and
                available appointment slots
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              loadDoctors();

              if (
                selectedDoctorId
              ) {
                loadSlots();
                loadSchedule();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            <RefreshCw
              size={17}
              className={
                loadingSlots
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-6">
        {/* ERROR */}

        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error}
          </div>
        )}

        {/* TOP GRID */}

        <div className="grid lg:grid-cols-[320px_1fr] gap-5">
          {/* DOCTORS */}

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
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
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
              ) : filteredDoctors.length ===
                0 ? (
                <div className="text-center py-10 text-slate-400">
                  No doctors found.
                </div>
              ) : (
                filteredDoctors.map(
                  (doctor) => {
                    const doctorId =
                      doctor.id ??
                      doctor.doctorId;

                    const doctorName =
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
                        key={doctorId}
                        onClick={() =>
                          setSelectedDoctorId(
                            String(
                              doctorId
                            )
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
                  }
                )
              )}
            </div>
          </section>

          {/* SLOT AREA */}

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

              {/* DATE */}

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Select Date
                </label>

                <input
                  type="date"
                  value={
                    selectedDate
                  }
                  onChange={(e) =>
                    setSelectedDate(
                      e.target.value
                    )
                  }
                  className="border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* SLOTS */}

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">
                    Available Time Slots
                  </h3>

                  <p className="text-xs text-slate-400">
                    {formatDate(
                      selectedDate
                    )}
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
              ) : slots.length ===
                0 ? (
                <div className="py-16 text-center border border-dashed border-slate-200 rounded-xl">
                  <Clock3
                    size={40}
                    className="mx-auto text-slate-300 mb-3"
                  />

                  <p className="font-semibold text-slate-600">
                    No available slots
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    Try another date or
                    doctor.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {slots.map(
                    (slot, index) => {
                      const time =
                        typeof slot ===
                        "string"
                          ? slot
                          : slot?.startTime ||
                            slot?.time ||
                            slot?.appointmentTime;

                      return (
                        <button
                          key={`${time}-${index}`}
                          onClick={() =>
                            handleSlotClick(
                              slot
                            )
                          }
                          className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-emerald-700 font-semibold text-sm transition"
                        >
                          <Clock3
                            size={17}
                            className="mx-auto mb-2"
                          />

                          {formatTime(
                            time
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* SCHEDULE */}

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
              ) : schedule.length ===
                0 ? (
                <p className="text-sm text-slate-400">
                  No schedule available.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {schedule.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <p className="font-semibold text-sm">
                          {item.dayOfWeek ||
                            item.day ||
                            "Day"}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          {formatTime(
                            item.startTime
                          )}{" "}
                          -{" "}
                          {formatTime(
                            item.endTime
                          )}
                        </p>
                      </div>
                    )
                  )}
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

function formatDate(date) {
  if (!date) return "";

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
}