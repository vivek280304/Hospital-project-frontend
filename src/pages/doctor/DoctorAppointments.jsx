import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  Loader2,
  Search,
  UserRound,
  XCircle,
} from "lucide-react";

import doctorService from "../../services/doctorService";

function DoctorAppointments() {

  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [completingId, setCompletingId] = useState(null);

  // ==========================================
  // LOAD APPOINTMENTS
  // ==========================================

  const loadAppointments = async () => {

    try {

      setLoading(true);
      setError("");

      const data =
        await doctorService.getAppointments(date);

      setAppointments(data || []);

    } catch (err) {

      console.error(
        "Failed to load appointments:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to load appointments."
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadAppointments();
  }, [date]);

  // ==========================================
  // COMPLETE APPOINTMENT
  // ==========================================

  const handleComplete = async (appointmentId) => {

    try {

      setCompletingId(appointmentId);

      await doctorService.completeAppointment(
        appointmentId
      );

      await loadAppointments();

    } catch (err) {

      console.error(
        "Failed to complete appointment:",
        err
      );

      alert(
        err?.response?.data?.message ||
        "Unable to complete appointment."
      );

    } finally {

      setCompletingId(null);

    }
  };

  // ==========================================
  // FILTER
  // ==========================================

  const filteredAppointments =
    appointments.filter((appointment) => {

      const matchesSearch =
        appointment.patientName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        String(appointment.patientId)
          .includes(search);

      const matchesStatus =
        statusFilter === "ALL" ||
        appointment.status === statusFilter;

      return matchesSearch && matchesStatus;

    });

  // ==========================================
  // COUNTS
  // ==========================================

  const bookedCount = appointments.filter(
    (a) => a.status === "BOOKED"
  ).length;

  const completedCount = appointments.filter(
    (a) => a.status === "COMPLETED"
  ).length;

  const cancelledCount = appointments.filter(
    (a) => a.status === "CANCELLED"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================
          HEADER
      ====================================== */}

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

          <button
            onClick={() =>
              navigate("/doctor/dashboard")
            }
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>

          <h1 className="text-lg font-bold text-slate-800">
            My Appointments
          </h1>

          <div className="w-20" />

        </div>

      </header>

      {/* =====================================
          CONTENT
      ====================================== */}

      <main className="mx-auto max-w-7xl p-5 sm:p-7">

        {/* TITLE */}

        <div className="mb-7">

          <h2 className="text-2xl font-bold text-slate-900">
            Appointments
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage your appointments and patient consultations.
          </p>

        </div>

        {/* ==================================
            STATS
        =================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <StatCard
            icon={<CalendarDays size={22} />}
            label="Booked"
            value={bookedCount}
            className="bg-blue-50 text-blue-600"
          />

          <StatCard
            icon={<CheckCircle2 size={22} />}
            label="Completed"
            value={completedCount}
            className="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            icon={<XCircle size={22} />}
            label="Cancelled"
            value={cancelledCount}
            className="bg-red-50 text-red-600"
          />

        </div>

        {/* ==================================
            FILTERS
        =================================== */}

        <div className="mb-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row">

            {/* Date */}

            <div className="relative">

              <CalendarDays
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                className="rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

            </div>

            {/* Search */}

            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search patient by name or ID..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

            </div>

            {/* Status */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="ALL">
                All Status
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

        {/* ==================================
            ERROR
        =================================== */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ==================================
            TABLE
        =================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">

          {loading ? (

            <div className="flex min-h-[300px] items-center justify-center">

              <div className="flex items-center gap-3 text-slate-500">

                <Loader2
                  size={22}
                  className="animate-spin text-blue-600"
                />

                Loading appointments...

              </div>

            </div>

          ) : filteredAppointments.length === 0 ? (

            <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <CalendarDays size={26} />
              </div>

              <h3 className="font-semibold text-slate-700">
                No appointments found
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                There are no appointments matching your filters.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">

                <thead>

                  <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                    <th className="px-6 py-4">
                      Time
                    </th>

                    <th className="px-6 py-4">
                      Patient
                    </th>

                    <th className="px-6 py-4">
                      Patient ID
                    </th>

                    <th className="px-6 py-4">
                      Reason
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>

                    <th className="px-6 py-4">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredAppointments.map(
                    (appointment) => (

                      <tr
                        key={appointment.appointmentId}
                        className="transition hover:bg-slate-50"
                      >

                        {/* TIME */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">

                            <Clock
                              size={17}
                              className="text-blue-500"
                            />

                            {appointment.appointmentTime}

                          </div>

                        </td>

                        {/* PATIENT */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">

                              <UserRound size={19} />

                            </div>

                            <div>

                              <p className="font-semibold text-slate-800">
                                {appointment.patientName}
                              </p>

                              <p className="text-xs text-slate-400">
                                Patient
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* PATIENT ID */}

                        <td className="px-6 py-5 text-sm text-slate-600">

                          P-
                          {String(
                            appointment.patientId
                          ).padStart(5, "0")}

                        </td>

                        {/* REASON */}

                        <td className="max-w-[220px] px-6 py-5 text-sm text-slate-600">

                          {appointment.reason ||
                            "General consultation"}

                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5">

                          <StatusBadge
                            status={
                              appointment.status
                            }
                          />

                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2">

                            <button
                              onClick={() =>
                                navigate(
                                  `/doctor/appointments/${appointment.appointmentId}/patient`
                                )
                              }
                              className="flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                            >
                              <Eye size={15} />
                              View
                            </button>

                            {appointment.status ===
                              "BOOKED" && (
                              <button
                                onClick={() =>
                                  handleComplete(
                                    appointment.appointmentId
                                  )
                                }
                                disabled={
                                  completingId ===
                                  appointment.appointmentId
                                }
                                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                              >

                                {completingId ===
                                appointment.appointmentId ? (
                                  <Loader2
                                    size={15}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <CheckCircle2
                                    size={15}
                                  />
                                )}

                                Complete

                              </button>
                            )}

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

/* ==============================================
   STAT CARD
============================================== */

function StatCard({
  icon,
  label,
  value,
  className,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

      <div className="flex items-center gap-4">

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${className}`}
        >
          {icon}
        </div>

        <div>

          <p className="text-2xl font-bold text-slate-900">
            {value}
          </p>

          <p className="text-sm text-slate-500">
            {label}
          </p>

        </div>

      </div>

    </div>
  );
}

/* ==============================================
   STATUS BADGE
============================================== */

function StatusBadge({ status }) {

  if (status === "COMPLETED") {
    return (
      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
        Completed
      </span>
    );
  }

  if (status === "CANCELLED") {
    return (
      <span className="inline-flex rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
        Cancelled
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
      Booked
    </span>
  );
}

export default DoctorAppointments;