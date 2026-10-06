import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  UserRound,
  Stethoscope,
  RefreshCw,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  ClipboardList,
  Loader2,
} from "lucide-react";

import receptionistService from "../../services/receptionistService";


// =====================================================
// DATE
// =====================================================

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (date) => {
  if (!date) return "";

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
};


// =====================================================
// FORMAT TIME
// =====================================================

const formatTime = (time) => {
  if (!time) return "-";

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
};


// =====================================================
// MAIN COMPONENT
// =====================================================

export default function ReceptionistAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);

  const [date, setDate] = useState(getToday());

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================================
  // LOAD APPOINTMENTS
  // =====================================================

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      console.log(
        "Loading receptionist appointments:",
        date
      );

      const data =
        await receptionistService.getAppointments(date);

      console.log(
        "Receptionist appointments response:",
        data
      );

      setAppointments(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {
      console.error(
        "Failed to load receptionist appointments:",
        err
      );

      setAppointments([]);

      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          "Unable to load appointments."
      );

    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // LOAD WHEN DATE CHANGES
  // =====================================================

  useEffect(() => {
    loadAppointments();
  }, [date]);


  // =====================================================
  // FILTER
  // =====================================================

  const filteredAppointments = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return appointments.filter(
      (appointment) => {

        const patientName =
          appointment.patientName || "";

        const doctorName =
          appointment.doctorName || "";

        const specialization =
          appointment.specialization || "";

        const reason =
          appointment.reason || "";

        const status =
          String(
            appointment.status || ""
          ).toUpperCase();

        const matchesSearch =
          !query ||
          patientName
            .toLowerCase()
            .includes(query) ||
          doctorName
            .toLowerCase()
            .includes(query) ||
          specialization
            .toLowerCase()
            .includes(query) ||
          reason
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          statusFilter === "ALL" ||
          status === statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    appointments,
    search,
    statusFilter,
  ]);


  // =====================================================
  // COUNTS
  // =====================================================

  const bookedCount =
    appointments.filter(
      (appointment) =>
        String(
          appointment.status || ""
        ).toUpperCase() === "BOOKED"
    ).length;

  const completedCount =
    appointments.filter(
      (appointment) =>
        String(
          appointment.status || ""
        ).toUpperCase() === "COMPLETED"
    ).length;

  const cancelledCount =
    appointments.filter(
      (appointment) =>
        String(
          appointment.status || ""
        ).toUpperCase() === "CANCELLED"
    ).length;


  // =====================================================
  // STATUS
  // =====================================================

  const getStatusStyle = (status) => {

    switch (
      String(status || "").toUpperCase()
    ) {

      case "BOOKED":
        return {
          wrapper:
            "bg-blue-50 text-blue-700 border-blue-200",
          icon:
            <Clock3 size={14} />,
          label:
            "Booked",
        };

      case "COMPLETED":
        return {
          wrapper:
            "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon:
            <CheckCircle2 size={14} />,
          label:
            "Completed",
        };

      case "CANCELLED":
        return {
          wrapper:
            "bg-red-50 text-red-700 border-red-200",
          icon:
            <XCircle size={14} />,
          label:
            "Cancelled",
        };

      default:
        return {
          wrapper:
            "bg-slate-50 text-slate-600 border-slate-200",
          icon:
            <ClipboardList size={14} />,
          label:
            status || "Unknown",
        };
    }
  };


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f5f9fd] text-slate-800">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-[1450px] items-center justify-between gap-4 px-5 py-4 lg:px-8">

          {/* LEFT */}

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/receptionist/dashboard"
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 transition hover:bg-blue-50 hover:text-blue-600"
            >
              <ArrowLeft size={20} />
            </button>

            <div>

              <h1 className="text-xl font-bold text-[#10264a] lg:text-2xl">
                Appointments
              </h1>

              <p className="text-sm text-slate-500">
                View and manage doctor appointments
              </p>

            </div>

          </div>


          {/* RIGHT */}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/receptionist/appointments/book"
              )
            }
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />

            <span className="hidden sm:inline">
              Book Appointment
            </span>

          </button>

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-[1450px] space-y-6 px-5 py-6 lg:px-8">


        {/* =================================================
            HERO
        ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-[#e7f3ff] to-[#dff0ff] p-6">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white">

                <CalendarDays size={14} />

                APPOINTMENT MANAGEMENT

              </div>

              <h2 className="text-2xl font-bold text-[#10264a] lg:text-3xl">
                Doctor Appointments
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {formatDate(date)}
              </p>

            </div>

            <div className="hidden h-20 w-20 items-center justify-center rounded-full bg-blue-100 md:flex">

              <CalendarDays
                size={38}
                className="text-blue-600"
              />

            </div>

          </div>

        </section>


        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon={
              <ClipboardList size={22} />
            }
            label="Total Appointments"
            value={appointments.length}
            className="bg-blue-50 text-blue-600"
          />

          <StatCard
            icon={
              <Clock3 size={22} />
            }
            label="Booked"
            value={bookedCount}
            className="bg-indigo-50 text-indigo-600"
          />

          <StatCard
            icon={
              <CheckCircle2 size={22} />
            }
            label="Completed"
            value={completedCount}
            className="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            icon={
              <XCircle size={22} />
            }
            label="Cancelled"
            value={cancelledCount}
            className="bg-red-50 text-red-600"
          />

        </section>


        {/* =================================================
            FILTERS
        ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* DATE */}

            <div>

              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Appointment Date
              </label>

              <div className="flex items-center gap-2">

                <div className="relative">

                  <CalendarDays
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    value={date}
                    onChange={(e) =>
                      setDate(e.target.value)
                    }
                    className="h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

                <button
                  type="button"
                  onClick={loadAppointments}
                  disabled={loading}
                  className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >

                  <RefreshCw
                    size={17}
                    className={
                      loading
                        ? "animate-spin"
                        : ""
                    }
                  />

                  <span className="hidden sm:inline">
                    Refresh
                  </span>

                </button>

              </div>

            </div>


            {/* SEARCH */}

            <div className="w-full lg:max-w-md">

              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Search
              </label>

              <div className="relative">

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
                  placeholder="Search patient, doctor..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

              </div>

            </div>


            {/* STATUS */}

            <div>

              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none focus:border-blue-500"
              >

                <option value="ALL">
                  All
                </option>

                <option value="BOOKED">
                  Booked
                </option>

                <option value="COMPLETED">
                  Completed
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>

              </select>

            </div>

          </div>

        </section>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>

        )}


        {/* =================================================
            APPOINTMENT TABLE
        ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

            <div>

              <h3 className="font-bold text-[#10264a]">
                Appointments
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {filteredAppointments.length} appointment
                {filteredAppointments.length !== 1
                  ? "s"
                  : ""}
              </p>

            </div>

          </div>


          {loading ? (

            <div className="flex min-h-[280px] items-center justify-center">

              <div className="flex flex-col items-center gap-3 text-slate-500">

                <Loader2
                  size={32}
                  className="animate-spin text-blue-600"
                />

                <p className="text-sm">
                  Loading appointments...
                </p>

              </div>

            </div>

          ) : filteredAppointments.length === 0 ? (

            <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

                <CalendarDays size={28} />

              </div>

              <h3 className="font-bold text-slate-800">
                No appointments found
              </h3>

              <p className="mt-1 max-w-md text-sm text-slate-500">
                There are no appointments matching
                your selected date and filters.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/receptionist/appointments/book"
                  )
                }
                className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >

                <Plus size={17} />

                Book Appointment

              </button>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[950px]">

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                    <th className="px-5 py-4">
                      Time
                    </th>

                    <th className="px-5 py-4">
                      Patient
                    </th>

                    <th className="px-5 py-4">
                      Doctor
                    </th>

                    <th className="px-5 py-4">
                      Specialization
                    </th>

                    <th className="px-5 py-4">
                      Reason
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredAppointments.map(
                    (appointment) => {

                      const status =
                        getStatusStyle(
                          appointment.status
                        );

                      return (

                        <tr
                          key={
                            appointment.id ??
                            appointment.appointmentId
                          }
                          className="border-b border-slate-100 transition hover:bg-slate-50"
                        >

                          {/* TIME */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2 font-semibold text-slate-800">

                              <Clock3
                                size={16}
                                className="text-blue-600"
                              />

                              {formatTime(
                                appointment.appointmentTime
                              )}

                            </div>

                          </td>


                          {/* PATIENT */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                                <UserRound
                                  size={18}
                                />

                              </div>

                              <div>

                                <p className="font-semibold text-slate-800">
                                  {appointment.patientName ||
                                    "Unknown Patient"}
                                </p>

                                <p className="text-xs text-slate-400">
                                  ID:{" "}
                                  {appointment.patientId ??
                                    "-"}
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* DOCTOR */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                                <Stethoscope
                                  size={18}
                                />

                              </div>

                              <div>

                                <p className="font-semibold text-slate-800">
                                  {appointment.doctorName ||
                                    "Unknown Doctor"}
                                </p>

                                <p className="text-xs text-slate-400">
                                  ID:{" "}
                                  {appointment.doctorId ??
                                    "-"}
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* SPECIALIZATION */}

                          <td className="px-5 py-4">

                            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                              {appointment.specialization ||
                                "-"}
                            </span>

                          </td>


                          {/* REASON */}

                          <td className="max-w-[220px] px-5 py-4">

                            <p className="truncate text-sm text-slate-600">
                              {appointment.reason ||
                                "General consultation"}
                            </p>

                          </td>


                          {/* STATUS */}

                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.wrapper}`}
                            >

                              {status.icon}

                              {status.label}

                            </span>

                          </td>

                        </tr>

                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}


// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  icon,
  label,
  value,
  className,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {value}
          </p>

        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${className}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}