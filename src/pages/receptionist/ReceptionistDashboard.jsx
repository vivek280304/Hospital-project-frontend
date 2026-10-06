import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Search,
  UserPlus,
  CalendarPlus,
  CalendarDays,
  Clock3,
  Users,
  UserRound,
  LogOut,
  LockKeyhole,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Eye,
  Stethoscope,
  Phone,
  ClipboardList,
  HeartPulse,
} from "lucide-react";

import receptionistService from "../../services/receptionistService";
import doctorService from "../../services/doctorService";

export default function ReceptionistDashboard() {
  const navigate = useNavigate();

  // =====================================================
  // DATE
  // =====================================================

  const getToday = () => {
    const now = new Date();

    return `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")}`;
  };

  const [selectedDate, setSelectedDate] =
    useState(getToday());

  // =====================================================
  // STATE
  // =====================================================

  const [profile, setProfile] = useState(null);

  const [appointments, setAppointments] =
    useState([]);

  const [doctors, setDoctors] = useState([]);

  const [doctorSchedules, setDoctorSchedules] =
    useState({});

  const [selectedDoctorId, setSelectedDoctorId] =
    useState("");

  const [slots, setSlots] = useState([]);

  const [patientSearch, setPatientSearch] =
    useState("");

  const [patientResults, setPatientResults] =
    useState([]);

  const [searchingPatients, setSearchingPatients] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [loadingSlots, setLoadingSlots] =
    useState(false);

  const [error, setError] = useState("");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const results =
        await Promise.allSettled([
          receptionistService.getProfile(),

          receptionistService.getAppointments(
            selectedDate
          ),

          doctorService.getDoctors(),
        ]);

      // PROFILE
      if (results[0].status === "fulfilled") {
        setProfile(results[0].value);
      }

      // APPOINTMENTS
      if (results[1].status === "fulfilled") {
        setAppointments(
          Array.isArray(results[1].value)
            ? results[1].value
            : []
        );
      } else {
        setAppointments([]);
      }

      // DOCTORS
      if (results[2].status === "fulfilled") {
        const doctorData =
          Array.isArray(results[2].value)
            ? results[2].value
            : [];

        setDoctors(doctorData);

        // Select first doctor automatically
        if (
          doctorData.length > 0 &&
          !selectedDoctorId
        ) {
          const firstDoctorId =
            doctorData[0]?.id ??
            doctorData[0]?.doctorId;

          if (firstDoctorId != null) {
            setSelectedDoctorId(
              String(firstDoctorId)
            );
          }
        }
      }

      if (
        results.every(
          (result) =>
            result.status === "rejected"
        )
      ) {
        setError(
          "Unable to load receptionist dashboard."
        );
      }
    } catch (err) {
      console.error(
        "Receptionist dashboard error:",
        err
      );

      setError(
        "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [selectedDate]);

  // =====================================================
  // LOAD DOCTOR SCHEDULES
  // =====================================================

  useEffect(() => {
    const loadSchedules = async () => {
      if (doctors.length === 0) {
        return;
      }

      const result = {};

      await Promise.all(
        doctors.map(async (doctor) => {
          const id =
            doctor?.id ??
            doctor?.doctorId;

          if (id == null) {
            return;
          }

          try {
            const schedule =
              await receptionistService.getDoctorSchedule(
                id
              );

            result[id] = Array.isArray(schedule)
              ? schedule
              : [];
          } catch (error) {
            console.error(
              `Schedule error for doctor ${id}`,
              error
            );

            result[id] = [];
          }
        })
      );

      setDoctorSchedules(result);
    };

    loadSchedules();
  }, [doctors]);

  // =====================================================
  // LOAD AVAILABLE SLOTS
  // =====================================================

  const loadSlots = async () => {
    if (!selectedDoctorId || !selectedDate) {
      setSlots([]);
      return;
    }

    try {
      setLoadingSlots(true);

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
        "Available slots error:",
        err
      );

      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, [
    selectedDoctorId,
    selectedDate,
  ]);

  // =====================================================
  // SEARCH PATIENTS
  // =====================================================

  useEffect(() => {
    const timer = setTimeout(async () => {
      const query =
        patientSearch.trim();

      if (!query) {
        setPatientResults([]);
        return;
      }

      try {
        setSearchingPatients(true);

        const data =
          await receptionistService.searchPatients(
            query
          );

        setPatientResults(
          Array.isArray(data)
            ? data.slice(0, 5)
            : []
        );
      } catch (err) {
        console.error(
          "Patient search error:",
          err
        );

        setPatientResults([]);
      } finally {
        setSearchingPatients(false);
      }
    }, 350);

    return () =>
      clearTimeout(timer);
  }, [patientSearch]);

  // =====================================================
  // COUNTS
  // =====================================================

  const bookedCount =
    appointments.filter(
      (appointment) =>
        String(
          appointment.status
        ).toUpperCase() === "BOOKED"
    ).length;

  const completedCount =
    appointments.filter(
      (appointment) =>
        String(
          appointment.status
        ).toUpperCase() ===
        "COMPLETED"
    ).length;

  const cancelledCount =
    appointments.filter(
      (appointment) =>
        String(
          appointment.status
        ).toUpperCase() ===
        "CANCELLED"
    ).length;

  // =====================================================
  // RECENT PATIENTS
  // Derived from today's real appointments
  // =====================================================

  const recentPatients =
    useMemo(() => {
      const map = new Map();

      appointments.forEach(
        (appointment) => {
          const id =
            appointment.patientId;

          if (
            id != null &&
            !map.has(id)
          ) {
            map.set(id, {
              patientId: id,
              name:
                appointment.patientName ||
                "Unknown",
              phone:
                appointment.phoneNumber ||
                appointment.patientPhone ||
                "-",
              gender:
                appointment.gender ||
                "-",
              dateOfBirth:
                appointment.dateOfBirth ||
                null,
            });
          }
        }
      );

      return Array.from(
        map.values()
      ).slice(0, 5);
    }, [appointments]);

  // =====================================================
  // SELECTED DOCTOR
  // =====================================================

  const selectedDoctor = useMemo(() => {
    return doctors.find((doctor) => {
      const id =
        doctor?.id ??
        doctor?.doctorId;

      return (
        String(id) ===
        String(selectedDoctorId)
      );
    });
  }, [
    doctors,
    selectedDoctorId,
  ]);

  // =====================================================
  // DOCTORS WORKING TODAY
  // =====================================================

  const todayDoctors =
    useMemo(() => {
      const dayName =
        new Date(
          `${selectedDate}T00:00:00`
        )
          .toLocaleDateString(
            "en-US",
            {
              weekday: "long",
            }
          )
          .toUpperCase();

      return doctors.map(
        (doctor) => {
          const id =
            doctor?.id ??
            doctor?.doctorId;

          const schedule =
            doctorSchedules[id] || [];

          const workingToday =
            schedule.some(
              (item) =>
                String(
                  item?.dayOfWeek || ""
                ).toUpperCase() ===
                dayName
            );

          return {
            ...doctor,
            workingToday,
          };
        }
      );
    }, [
      doctors,
      doctorSchedules,
      selectedDate,
    ]);

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) return "-";

    const parts =
      String(time).split(":");

    const hour = Number(parts[0]);
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
  // AGE
  // =====================================================

  const calculateAge = (
    dateOfBirth
  ) => {
    if (!dateOfBirth) {
      return "-";
    }

    const dob = new Date(
      `${dateOfBirth}T00:00:00`
    );

    if (Number.isNaN(dob.getTime())) {
      return "-";
    }

    const today = new Date();

    let age =
      today.getFullYear() -
      dob.getFullYear();

    const month =
      today.getMonth() -
      dob.getMonth();

    if (
      month < 0 ||
      (month === 0 &&
        today.getDate() <
          dob.getDate())
    ) {
      age--;
    }

    return age;
  };

  // =====================================================
  // STATUS
  // =====================================================

  const getStatusClass = (
    status
  ) => {
    const value =
      String(status || "")
        .toUpperCase();

    if (
      value === "COMPLETED"
    ) {
      return "bg-emerald-100 text-emerald-700";
    }

    if (
      value === "CANCELLED"
    ) {
      return "bg-red-100 text-red-700";
    }

    if (
      value === "BOOKED"
    ) {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-slate-100 text-slate-600";
  };

  // =====================================================
  // NAVIGATION
  // =====================================================

  const nav = (path) => {
    setSidebarOpen(false);

    navigate(path);
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();

    navigate(
      "/receptionist/login",
      {
        replace: true,
      }
    );
  };

  const openBookAppointment =
    (doctorId = null) => {
      if (doctorId) {
        navigate(
          "/receptionist/appointments/book",
          {
            state: {
              doctorId,
            },
          }
        );
      } else {
        navigate(
          "/receptionist/appointments/book"
        );
      }
    };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f5f9fd] text-[#10264a]">
      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          h-screen
          w-[252px]
          bg-[#0b1b31]
          text-white
          flex
          flex-col
          transition-transform
          duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* LOGO */}

        <div className="h-[82px] px-6 flex items-center border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9">
              <div className="absolute left-0 top-3 w-6 h-6 rounded-md bg-blue-600" />

              <div className="absolute left-3 top-0 w-6 h-6 rounded-md bg-blue-400" />

              <div className="absolute left-3 top-3 w-3 h-3 rounded-sm bg-white" />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                MediCare
              </h1>

              <p className="text-[10px] text-blue-100">
                Hospital Management System
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setSidebarOpen(false)
            }
            className="ml-auto lg:hidden"
          >
            <X />
          </button>
        </div>

        {/* PROFILE */}

        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-blue-600 text-xl font-bold overflow-hidden">
              {profile?.profileImage ? (
                <img
                  src={
                    profile.profileImage
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                (
                  profile?.name ||
                  "R"
                )
                  .charAt(0)
                  .toUpperCase()
              )}
            </div>

            <div className="min-w-0">
              <h2 className="font-bold truncate">
                {profile?.name ||
                  "Receptionist"}
              </h2>

              <p className="text-sm text-slate-300">
                Receptionist
              </p>

              <div className="flex items-center gap-2 mt-1 text-xs text-slate-300">
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                Online
              </div>
            </div>
          </div>
        </div>

        {/* NAV */}

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active
            onClick={() =>
              nav(
                "/receptionist/dashboard"
              )
            }
          />

          <SidebarItem
            icon={<Search size={20} />}
            label="Patient Search"
            onClick={() =>
              nav(
                "/receptionist/patients"
              )
            }
          />

          <SidebarItem
            icon={<UserPlus size={20} />}
            label="Register Patient"
            onClick={() =>
              nav(
                "/receptionist/patients/add"
              )
            }
          />

          <SidebarItem
            icon={<CalendarPlus size={20} />}
            label="Book Appointment"
            onClick={() =>
              openBookAppointment()
            }
          />

          <SidebarItem
            icon={<CalendarDays size={20} />}
            label="Doctor Schedules"
            onClick={() =>
              nav(
                "/receptionist/doctor-slots"
              )
            }
          />

          <SidebarItem
            icon={<Clock3 size={20} />}
            label="Available Slots"
            onClick={() =>
              nav(
                "/receptionist/doctor-slots"
              )
            }
          />

          <SidebarItem
            icon={<CalendarDays size={20} />}
            label="Appointments"
            onClick={() =>
              nav(
                "/receptionist/appointments"
              )
            }
          />

          <SidebarItem
            icon={<UserRound size={20} />}
            label="Patient Details"
            onClick={() =>
              nav(
                "/receptionist/patients"
              )
            }
          />

          <SidebarItem
            icon={<UserRound size={20} />}
            label="Profile"
            onClick={() =>
              nav(
                "/receptionist/profile"
              )
            }
          />

          <SidebarItem
            icon={<LockKeyhole size={20} />}
            label="Change Password"
            onClick={() =>
              nav(
                "/receptionist/change-password"
              )
            }
          />
        </nav>

        {/* LOGOUT */}

        <div className="px-3 pb-5">
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 px-5 py-3 rounded-xl text-red-400 hover:bg-red-500/10"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="lg:ml-[252px] min-h-screen">
        {/* TOP BAR */}

        <header className="h-[74px] bg-white border-b border-slate-200 px-5 lg:px-7 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setSidebarOpen(true)
              }
              className="lg:hidden"
            >
              <Menu size={24} />
            </button>

            {/* SEARCH */}

            <div className="hidden md:flex items-center w-[500px] bg-[#eef5fb] rounded-xl px-4 py-3">
              <Search
                size={20}
                className="text-slate-500"
              />

              <input
                value={patientSearch}
                onChange={(e) =>
                  setPatientSearch(
                    e.target.value
                  )
                }
                placeholder="Search patients, doctors, appointments..."
                className="ml-3 bg-transparent outline-none w-full text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={loadDashboard}
              className="p-2 rounded-lg hover:bg-slate-100"
              title="Refresh"
            >
              <RefreshCw
                size={19}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />
            </button>

            <div className="hidden sm:block text-right">
              <p className="font-bold text-sm">
                {profile?.name ||
                  "Receptionist"}
              </p>

              <p className="text-xs text-slate-400">
                Receptionist
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {(
                profile?.name ||
                "R"
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <ChevronDown
              size={18}
              className="text-slate-500"
            />
          </div>
        </header>

        <div className="p-4 lg:p-5">
          {/* =================================================
              SEARCH RESULTS
          ================================================= */}

          {patientSearch && (
            <div className="relative z-20 mb-4">
              <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 max-w-[600px]">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">
                    Patient Search
                  </p>

                  {searchingPatients && (
                    <span className="text-xs text-slate-400">
                      Searching...
                    </span>
                  )}
                </div>

                {patientResults.length ===
                0 ? (
                  <p className="text-sm text-slate-400 p-3">
                    No patients found.
                  </p>
                ) : (
                  patientResults.map(
                    (patient) => (
                      <button
                        key={
                          patient.patientId
                        }
                        onClick={() =>
                          navigate(
                            `/receptionist/patients/${patient.patientId}`
                          )
                        }
                        className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg text-left"
                      >
                        <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                          {patient.name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="flex-1">
                          <p className="font-semibold text-sm">
                            {patient.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            P-
                            {String(
                              patient.patientId
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
                          size={17}
                        />
                      </button>
                    )
                  )
                )}
              </div>
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          {/* =================================================
              TOP GRID
          ================================================= */}

          <div className="grid xl:grid-cols-[1fr_395px] gap-4">
            {/* LEFT */}

            <div>
              {/* WELCOME */}

              <section className="relative overflow-hidden bg-gradient-to-r from-[#e8f4ff] to-[#d9edff] rounded-xl min-h-[112px] p-6">
                <div className="relative z-10">
                  <span className="inline-block bg-blue-500/90 text-white text-xs font-semibold px-3 py-2 rounded-sm">
                    RECEPTION
                  </span>

                  <h1 className="text-2xl lg:text-[28px] font-bold mt-2">
                    Welcome Back,{" "}
                    {profile?.name ||
                      "Receptionist"}
                    !
                  </h1>

                  <p className="text-sm text-slate-500 mt-1">
                    Manage patients, book
                    appointments and help
                    them get the best care.
                  </p>
                </div>

                <div className="absolute right-8 bottom-0 hidden lg:block">
                  <div className="w-40 h-28 flex items-end justify-center">
                    <div className="w-20 h-20 rounded-t-full bg-blue-200/70 flex items-center justify-center">
                      <HeartPulse
                        size={42}
                        className="text-blue-600"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* STATS */}

              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mt-4">
                <StatCard
                  icon={
                    <Users size={24} />
                  }
                  value={
                    recentPatients.length
                  }
                  label="Recent Patients"
                  note={`${appointments.length} appointments today`}
                  type="green"
                />

                <StatCard
                  icon={
                    <CalendarDays
                      size={24}
                    />
                  }
                  value={
                    appointments.length
                  }
                  label="Today's Appointments"
                  note={`${bookedCount} booked`}
                  type="blue"
                />

                <StatCard
                  icon={
                    <Stethoscope
                      size={24}
                    />
                  }
                  value={
                    todayDoctors.filter(
                      (doctor) =>
                        doctor.workingToday
                    ).length
                  }
                  label="Available Doctors"
                  note={`${doctors.length} total doctors`}
                  type="purple"
                />

                <StatCard
                  icon={
                    <Clock3 size={24} />
                  }
                  value={bookedCount}
                  label="Pending Bookings"
                  note={
                    cancelledCount > 0
                      ? `${cancelledCount} cancelled`
                      : "Need attention"
                  }
                  type="orange"
                />
              </div>
            </div>

            {/* QUICK ACTIONS */}

            <section className="bg-white rounded-xl border border-slate-200 p-4">
              <h2 className="text-lg font-bold mb-4">
                Quick Actions
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <QuickAction
                  icon={
                    <UserPlus size={25} />
                  }
                  label="Register Patient"
                  type="blue"
                  onClick={() =>
                    nav(
                      "/receptionist/patients/add"
                    )
                  }
                />

                <QuickAction
                  icon={
                    <CalendarPlus
                      size={25}
                    />
                  }
                  label="Book Appointment"
                  type="green"
                  onClick={() =>
                    openBookAppointment()
                  }
                />

                <QuickAction
                  icon={
                    <CalendarDays
                      size={25}
                    />
                  }
                  label="View Doctor Schedules"
                  type="purple"
                  onClick={() =>
                    nav(
                      "/receptionist/doctor-slots"
                    )
                  }
                />

                <QuickAction
                  icon={
                    <Clock3 size={25} />
                  }
                  label="Find Available Slots"
                  type="orange"
                  onClick={() =>
                    nav(
                      "/receptionist/doctor-slots"
                    )
                  }
                />
              </div>
            </section>
          </div>

          {/* =================================================
              SECOND ROW
          ================================================= */}

          <div className="grid xl:grid-cols-[1fr_395px] gap-4 mt-4">
            {/* TODAY APPOINTMENTS */}

            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">
                    Today's Appointments
                  </h2>

                  <p className="text-xs text-slate-400 mt-1">
                    {formatDateLong(
                      selectedDate
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) =>
                      setSelectedDate(
                        e.target.value
                      )
                    }
                    className="border border-slate-200 rounded-lg px-2 py-2 text-xs"
                  />

                  <button
                    onClick={() =>
                      nav(
                        "/receptionist/appointments"
                      )
                    }
                    className="text-blue-600 text-sm font-semibold"
                  >
                    View All
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px]">
                  <thead>
                    <tr className="bg-[#f1f6fb] text-left">
                      <th className="px-4 py-3 text-xs">
                        Time
                      </th>

                      <th className="px-4 py-3 text-xs">
                        Patient Name
                      </th>

                      <th className="px-4 py-3 text-xs">
                        Doctor
                      </th>

                      <th className="px-4 py-3 text-xs">
                        Specialization
                      </th>

                      <th className="px-4 py-3 text-xs">
                        Status
                      </th>

                      <th className="px-4 py-3 text-xs">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-10 text-slate-400"
                        >
                          Loading appointments...
                        </td>
                      </tr>
                    ) : appointments.length ===
                      0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-10 text-slate-400"
                        >
                          No appointments for
                          this date.
                        </td>
                      </tr>
                    ) : (
                      appointments
                        .slice(0, 6)
                        .map(
                          (
                            appointment
                          ) => (
                            <tr
                              key={
                                appointment.appointmentId
                              }
                              className="border-t border-slate-100 hover:bg-slate-50"
                            >
                              <td className="px-4 py-3 text-sm">
                                {formatTime(
                                  appointment.appointmentTime
                                )}
                              </td>

                              <td className="px-4 py-3">
                                <p className="font-semibold text-sm">
                                  {
                                    appointment.patientName
                                  }
                                </p>

                                <p className="text-[11px] text-slate-400">
                                  ID:{" "}
                                  {
                                    appointment.patientId
                                  }
                                </p>
                              </td>

                              <td className="px-4 py-3 text-sm">
                                {
                                  appointment.doctorName
                                }
                              </td>

                              <td className="px-4 py-3 text-sm text-slate-500">
                                {
                                  appointment.specialization
                                }
                              </td>

                              <td className="px-4 py-3">
                                <span
                                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold ${getStatusClass(
                                    appointment.status
                                  )}`}
                                >
                                  {
                                    appointment.status
                                  }
                                </span>
                              </td>

                              <td className="px-4 py-3">
                                <button
                                  onClick={() =>
                                    nav(
                                      `/receptionist/appointments?appointmentId=${appointment.appointmentId}`
                                    )
                                  }
                                  className="border border-blue-200 text-blue-600 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"
                                >
                                  <Eye
                                    size={
                                      14
                                    }
                                  />
                                  View
                                </button>
                              </td>
                            </tr>
                          )
                        )
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* AVAILABLE DOCTORS */}

            <section className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">
                  Available Doctors Today
                </h2>

                <button
                  onClick={() =>
                    nav(
                      "/receptionist/doctor-slots"
                    )
                  }
                  className="text-blue-600 text-sm"
                >
                  View Schedule
                </button>
              </div>

              <div className="space-y-1">
                {todayDoctors
                  .slice(0, 5)
                  .map((doctor) => {
                    const doctorId =
                      doctor?.id ??
                      doctor?.doctorId;

                    const doctorName =
                      doctor?.name ||
                      doctor?.doctorName ||
                      "Doctor";

                    const specialization =
                      doctor?.specialization ||
                      "General";

                    return (
                      <div
                        key={doctorId}
                        className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                          {doctorName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                       
<div className="flex-1 min-w-0">
  <p className="font-semibold text-sm truncate">
    {doctorName}
  </p>

  <p className="text-xs text-slate-400">
    {specialization}
  </p>
</div>



                        {doctor.workingToday ? (
                          <button
                            onClick={() =>
                              openBookAppointment(
                                doctorId
                              )
                            }
                            className="border border-blue-200 text-blue-600 px-3 py-2 rounded-lg text-xs"
                          >
                            Book
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              nav(
                                "/receptionist/doctor-slots"
                              )
                            }
                            className="border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-xs"
                          >
                            View
                          </button>
                        )}
                      </div>
                    );
                  })}

                {doctors.length ===
                  0 && (
                  <p className="text-center py-8 text-slate-400 text-sm">
                    No doctors found.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* =================================================
              THIRD ROW
          ================================================= */}

          <div className="grid xl:grid-cols-[1fr_1fr_1fr] gap-4 mt-4">
            {/* RECENT PATIENTS */}

            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-4 flex justify-between">
                <h2 className="text-lg font-bold">
                  Recent Patients
                </h2>

                <button
                  onClick={() =>
                    nav(
                      "/receptionist/patients"
                    )
                  }
                  className="text-blue-600 text-sm"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[550px]">
                  <thead>
                    <tr className="bg-[#f1f6fb] text-left">
                      <th className="px-4 py-3 text-xs">
                        ID
                      </th>

                      <th className="px-4 py-3 text-xs">
                        Name
                      </th>

                      <th className="px-4 py-3 text-xs">
                        Age / Gender
                      </th>

                      <th className="px-4 py-3 text-xs">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentPatients.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center py-8 text-slate-400 text-sm"
                        >
                          No recent patients.
                        </td>
                      </tr>
                    ) : (
                      recentPatients.map(
                        (patient) => (
                          <tr
                            key={
                              patient.patientId
                            }
                            className="border-t border-slate-100"
                          >
                            <td className="px-4 py-3 text-xs">
                              P-
                              {String(
                                patient.patientId
                              ).padStart(
                                3,
                                "0"
                              )}
                            </td>

                            <td className="px-4 py-3">
                              <p className="font-semibold text-xs">
                                {
                                  patient.name
                                }
                              </p>
                            </td>

                            <td className="px-4 py-3 text-xs text-slate-500">
                              {calculateAge(
                                patient.dateOfBirth
                              )}{" "}
                              /{" "}
                              {
                                patient.gender
                              }
                            </td>

                            <td className="px-4 py-3">
                              <button
                                onClick={() =>
                                  nav(
                                    `/receptionist/patients/${patient.patientId}`
                                  )
                                }
                                className="border border-blue-200 text-blue-600 px-3 py-1.5 rounded-lg text-xs"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* PATIENT SEARCH */}

            <section className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-bold">
                  Patient Search
                </h2>
              </div>

              <div className="relative mb-3">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={patientSearch}
                  onChange={(e) =>
                    setPatientSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search by name, phone, or patient ID..."
                  className="w-full border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                {patientResults
                  .slice(0, 3)
                  .map((patient) => (
                    <div
                      key={
                        patient.patientId
                      }
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50"
                    >
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        {patient.name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs truncate">
                          {patient.name}
                        </p>

                        <p className="text-[10px] text-slate-400">
                          P-
                          {String(
                            patient.patientId
                          ).padStart(
                            3,
                            "0"
                          )}{" "}
                          •{" "}
                          {
                            patient.phoneNumber
                          }
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          nav(
                            `/receptionist/patients/${patient.patientId}`
                          )
                        }
                        className="border border-blue-200 text-blue-600 px-3 py-1.5 rounded-lg text-xs"
                      >
                        View
                      </button>
                    </div>
                  ))}

                {!patientSearch && (
                  <div className="py-8 text-center text-slate-400 text-sm">
                    Search for a patient.
                  </div>
                )}

                {patientSearch &&
                  !searchingPatients &&
                  patientResults.length ===
                    0 && (
                    <div className="py-8 text-center text-slate-400 text-sm">
                      No patients found.
                    </div>
                  )}
              </div>
            </section>

            {/* SLOT AVAILABILITY */}

            <section className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">
                  Today's Slot Availability
                </h2>

                <button
                  onClick={() =>
                    nav(
                      "/receptionist/doctor-slots"
                    )
                  }
                  className="text-blue-600 text-sm"
                >
                  View All Slots
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">
                    Select Doctor
                  </label>

                  <select
                    value={
                      selectedDoctorId
                    }
                    onChange={(e) =>
                      setSelectedDoctorId(
                        e.target.value
                      )
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none"
                  >
                    {doctors.map(
                      (doctor) => {
                        const id =
                          doctor?.id ??
                          doctor?.doctorId;

                        return (
                          <option
                            key={id}
                            value={id}
                          >
                            {doctor?.name ||
                              doctor?.doctorName ||
                              "Doctor"}
                          </option>
                        );
                      }
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-500 block mb-1">
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
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>

              {selectedDoctor && (
                <div className="text-xs text-slate-500 mb-3">
                  <span className="font-semibold text-slate-700">
                    {selectedDoctor?.name ||
                      selectedDoctor?.doctorName}
                  </span>

                  {selectedDoctor?.specialization
                    ? ` (${selectedDoctor.specialization})`
                    : ""}
                </div>
              )}

              {loadingSlots ? (
                <div className="py-8 text-center text-slate-400 text-sm">
                  Loading slots...
                </div>
              ) : slots.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No available slots.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {slots
                    .slice(0, 9)
                    .map(
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
                              "";

                        return (
                          <button
                            key={`${time}-${index}`}
                            onClick={() =>
                              openBookAppointment(
                                selectedDoctorId
                              )
                            }
                            className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-700 rounded-lg py-2 text-xs font-semibold"
                          >
                            {formatTime(
                              time
                            )}
                          </button>
                        );
                      }
                    )}
                </div>
              )}

              {slots.length >
                9 && (
                <p className="text-center text-xs text-slate-400 mt-3">
                  +{" "}
                  {slots.length - 9}{" "}
                  more available slots
                </p>
              )}

              <button
                onClick={() =>
                  openBookAppointment(
                    selectedDoctorId
                  )
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg mt-4 text-sm font-semibold"
              >
                Book Appointment
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

// =======================================================
// SIDEBAR ITEM
// =======================================================

function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm transition ${
        active
          ? "bg-blue-600 text-white"
          : "text-slate-200 hover:bg-white/10"
      }`}
    >
      {icon}

      <span>{label}</span>
    </button>
  );
}

// =======================================================
// STAT CARD
// =======================================================

function StatCard({
  icon,
  value,
  label,
  note,
  type,
}) {
  const styles = {
    green:
      "bg-emerald-50 text-emerald-600",
    blue:
      "bg-blue-50 text-blue-600",
    purple:
      "bg-purple-50 text-purple-600",
    orange:
      "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            styles[type]
          }`}
        >
          {icon}
        </div>

        <div>
          <p className="text-2xl font-bold">
            {value}
          </p>

          <p className="text-xs text-slate-500">
            {label}
          </p>
        </div>
      </div>

      <p className="text-[10px] text-emerald-600 mt-2 ml-1">
        {note}
      </p>
    </div>
  );
}

// =======================================================
// QUICK ACTION
// =======================================================

function QuickAction({
  icon,
  label,
  type,
  onClick,
}) {
  const styles = {
    blue:
      "bg-blue-50 text-blue-600 hover:bg-blue-100",
    green:
      "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
    purple:
      "bg-purple-50 text-purple-600 hover:bg-purple-100",
    orange:
      "bg-orange-50 text-orange-600 hover:bg-orange-100",
  };

  return (
    <button
      onClick={onClick}
      className={`${styles[type]} rounded-xl p-4 flex flex-col items-center justify-center gap-2 min-h-[85px]`}
    >
      {icon}

      <span className="text-xs font-semibold text-[#10264a] text-center">
        {label}
      </span>
    </button>
  );
}

// =======================================================
// DATE FORMAT
// =======================================================

function formatDateLong(date) {
  if (!date) return "";

  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}