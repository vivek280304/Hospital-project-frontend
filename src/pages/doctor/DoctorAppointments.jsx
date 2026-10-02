import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  Loader2,
  Search,
  UserRound,
  FileText,
  XCircle,
} from "lucide-react";

import doctorService from "../../services/doctorService";

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function DoctorAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState(() =>
    formatLocalDate(new Date())
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [completingId, setCompletingId] = useState(null);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await doctorService.getAppointments(date);

      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load appointments:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [date]);

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const matchesSearch =
        !query ||
        String(appointment.patientName || "")
          .toLowerCase()
          .includes(query) ||
        String(appointment.patientId || "")
          .toLowerCase()
          .includes(query) ||
        String(appointment.reason || "")
          .toLowerCase()
          .includes(query);

      const status = String(
        appointment.status || ""
      ).toUpperCase();

      const matchesStatus =
        statusFilter === "ALL" ||
        status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

  const bookedCount = appointments.filter(
    (a) =>
      String(a.status).toUpperCase() === "BOOKED"
  ).length;

  const completedCount = appointments.filter(
    (a) =>
      String(a.status).toUpperCase() === "COMPLETED"
  ).length;

  const cancelledCount = appointments.filter(
    (a) =>
      String(a.status).toUpperCase() === "CANCELLED"
  ).length;

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

  const getStatusClass = (status) => {
    switch (
      String(status || "").toUpperCase()
    ) {
      case "BOOKED":
        return "bg-blue-50 text-blue-600";

      case "COMPLETED":
        return "bg-emerald-50 text-emerald-600";

      case "CANCELLED":
        return "bg-red-50 text-red-600";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <button
            type="button"
            onClick={() =>
              navigate("/doctor/dashboard")
            }
            className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>

          <h1 className="text-2xl font-bold text-slate-900">
            My Appointments
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your appointments and patient
            consultations.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            icon={<CalendarDays size={24} />}
            value={bookedCount}
            label="Booked"
            className="bg-blue-50 text-blue-600"
          />

          <StatCard
            icon={<CheckCircle2 size={24} />}
            value={completedCount}
            label="Completed"
            className="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            icon={<XCircle size={24} />}
            value={cancelledCount}
            label="Cancelled"
            className="bg-red-50 text-red-600"
          />
        </section>

        {/* Filters */}
        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[230px_minmax(0,1fr)_160px]">
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
                className="w-full rounded-xl border border-slate-200 px-10 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

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
                placeholder="Search patient by name or ID..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="BOOKED">Booked</option>
              <option value="COMPLETED">
                Completed
              </option>
              <option value="CANCELLED">
                Cancelled
              </option>
            </select>
          </div>
        </section>

        {/* Appointment Table */}
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
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

                  <th className="px-6 py-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-16 text-center"
                    >
                      <Loader2
                        size={28}
                        className="mx-auto animate-spin text-blue-600"
                      />

                      <p className="mt-3 text-sm text-slate-500">
                        Loading appointments...
                      </p>
                    </td>
                  </tr>
                ) : filteredAppointments.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-16 text-center"
                    >
                      <CalendarDays
                        size={32}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-3 text-sm text-slate-500">
                        No appointments found.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map(
                    (appointment) => {
                      const status =
                        String(
                          appointment.status || ""
                        ).toUpperCase();

                      const isCompleted =
                        status === "COMPLETED";

                      return (
                        <tr
                          key={
                            appointment.appointmentId
                          }
                          className="border-t border-slate-100 hover:bg-slate-50"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                              <Clock3
                                size={17}
                                className="text-blue-500"
                              />

                              {appointment.appointmentTime ||
                                "—"}
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                <UserRound
                                  size={19}
                                />
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-slate-800">
                                  {appointment.patientName ||
                                    "Unknown Patient"}
                                </p>

                                <p className="text-xs text-slate-400">
                                  Patient
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-600">
                            {appointment.patientId !=
                            null
                              ? `P-${String(
                                  appointment.patientId
                                ).padStart(5, "0")}`
                              : "—"}
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-600">
                            {appointment.reason ||
                              "General consultation"}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                                appointment.status
                              )}`}
                            >
                              {appointment.status ||
                                "UNKNOWN"}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex justify-end gap-2">
                              {/* DOCTOR REPORT: available only for BOOKED or COMPLETED */}
                             {/* CREATE MEDICAL REPORT */}
{["BOOKED", "COMPLETED"].includes(status) && (
  <button
    type="button"
    onClick={() =>
      navigate(
        `/doctor/appointments/${appointment.appointmentId}/report`
      )
    }
    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
  >
    <FileText size={16} />
    Create Report
  </button>
)}

{/* SEE PATIENT LAB REPORTS */}
{appointment.patientId != null && (
  <button
    type="button"
    onClick={() =>
      navigate(
        `/doctor/patients/${appointment.patientId}/history`
      )
    }
    className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-4 py-2.5 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50"
  >
    <Eye size={16} />
    Lab Reports
  </button>
)}

                              {/* COMPLETE */}
                              {!isCompleted && (
                                <button
                                  type="button"
                                  disabled={
                                    completingId ===
                                    appointment.appointmentId
                                  }
                                  onClick={() =>
                                    handleComplete(
                                      appointment.appointmentId
                                    )
                                  }
                                  className="flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {completingId ===
                                  appointment.appointmentId ? (
                                    <Loader2
                                      size={16}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <CheckCircle2
                                      size={16}
                                    />
                                  )}

                                  Complete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  className,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl ${className}`}
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

export default DoctorAppointments;