import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  Search,
  UserRound,
} from "lucide-react";

import doctorService from "../../services/doctorService";

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function DoctorPatients() {
  const navigate = useNavigate();

  const [date, setDate] = useState(() =>
    formatLocalDate(new Date())
  );

  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await doctorService.getAppointments(date);

      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load patients:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load patients."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [date]);

  const filteredAppointments = appointments.filter((appointment) => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      String(appointment.patientName || "")
        .toLowerCase()
        .includes(query) ||
      String(appointment.patientId || "")
        .toLowerCase()
        .includes(query) ||
      String(appointment.reason || "")
        .toLowerCase()
        .includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="flex items-center px-6 py-5">

          <button
            type="button"
            onClick={() => navigate("/doctor/dashboard")}
            className="mr-4 rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft size={21} />
          </button>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Patient Details
            </h1>

            <p className="text-sm text-slate-500">
              View patients and their appointments
            </p>
          </div>

        </div>
      </header>

      <main className="p-6">

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            {/* Date */}
            <div className="flex items-center gap-3">

              <CalendarDays
                size={20}
                className="text-blue-600"
              />

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Appointment Date
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search patient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
              />

            </div>

          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center">

              <UserRound
                size={45}
                className="mb-3 text-slate-300"
              />

              <h3 className="font-semibold text-slate-700">
                No patients found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                No appointments found for this date.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="border-b border-slate-200 bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Patient
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Patient ID
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Time
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Reason
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredAppointments.map((appointment) => (

                    <tr
                      key={appointment.appointmentId}
                      className="hover:bg-slate-50"
                    >

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <UserRound size={19} />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {appointment.patientName || "Unknown"}
                            </p>

                            <p className="text-xs text-slate-500">
                              Patient
                            </p>
                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        P-
                        {String(appointment.patientId || "").padStart(
                          5,
                          "0"
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {appointment.appointmentTime || "-"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {appointment.reason || "General consultation"}
                      </td>

                      <td className="px-6 py-4">

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                          {appointment.status || "BOOKED"}
                        </span>

                      </td>

                      <td className="px-6 py-4 text-right">

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/doctor/appointments/${appointment.appointmentId}/patient`,
                              {
                                state: {
                                  appointment,
                                },
                              }
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          <Eye size={16} />
                          View
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </main>
    </div>
  );
}

export default DoctorPatients;