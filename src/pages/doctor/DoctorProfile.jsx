import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  UserRound,
  Phone,
  Mail,
  CalendarDays,
  Eye,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";

import doctorService from "../../services/doctorService";

function DoctorPatients() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await doctorService.getMyPatients();

      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Patients loading error:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Unable to load patients."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return patients;
    }

    return patients.filter((patient) => {
      return (
        String(patient.patientName || "")
          .toLowerCase()
          .includes(query) ||
        String(patient.patientId || "")
          .toLowerCase()
          .includes(query) ||
        String(patient.email || "")
          .toLowerCase()
          .includes(query) ||
        String(patient.phoneNumber || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [patients, search]);

  const getPatientId = (id) => {
    if (id == null) {
      return "N/A";
    }

    return `P-${String(id).padStart(5, "0")}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* HEADER */}
      <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">

        <div className="flex items-center">

          <button
            type="button"
            onClick={() => navigate("/doctor/dashboard")}
            className="mr-4 rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
          >
            <ArrowLeft size={21} />
          </button>

          <div>
            <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
              My Patients
            </h1>

            <p className="text-xs text-slate-500 sm:text-sm">
              Patients associated with your appointments
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={loadPatients}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>

      </header>

      <main className="mx-auto max-w-7xl p-4 sm:p-6">

        {/* TOP SUMMARY */}
        <section className="mb-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white shadow-sm">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">
                <UserRound size={28} />
              </div>

              <div>
                <p className="text-sm text-blue-100">
                  Patient Management
                </p>

                <h2 className="text-2xl font-bold">
                  My Patients
                </h2>

                <p className="mt-1 text-sm text-blue-100">
                  View complete medical history, reports and tests.
                </p>
              </div>

            </div>

            <div className="rounded-xl bg-white/10 px-6 py-4 text-center">

              <p className="text-xs text-blue-100">
                Total Patients
              </p>

              <p className="mt-1 text-2xl font-bold">
                {patients.length}
              </p>

            </div>

          </div>

        </section>

        {/* SEARCH */}
        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="relative max-w-xl">

            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient name, ID, email or phone..."
              className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          <p className="mt-3 text-xs text-slate-400">
            Showing {filteredPatients.length} of {patients.length} patients
          </p>

        </section>

        {/* ERROR */}
        {error && (
          <section className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-5">

            <div className="flex items-start gap-3">

              <AlertCircle
                size={21}
                className="mt-0.5 shrink-0 text-red-500"
              />

              <div>
                <p className="font-semibold text-red-700">
                  Unable to load patients
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={loadPatients}
                  className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>

            </div>

          </section>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-slate-200 bg-white">

            <div className="flex flex-col items-center">

              <Loader2
                size={40}
                className="animate-spin text-blue-600"
              />

              <p className="mt-4 text-sm text-slate-500">
                Loading your patients...
              </p>

            </div>

          </div>
        ) : filteredPatients.length === 0 ? (

          /* EMPTY */
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <UserRound size={30} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-700">
              {search
                ? "No matching patients"
                : "No patients found"}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {search
                ? "Try another search."
                : "Patients will appear here after appointments."}
            </p>

          </div>

        ) : (

          /* PATIENT GRID */
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredPatients.map((patient) => (

              <article
                key={patient.patientId}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >

                {/* Patient header */}
                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <UserRound size={23} />
                    </div>

                    <div>

                      <h3 className="font-bold text-slate-900">
                        {patient.patientName || "Unknown Patient"}
                      </h3>

                      <p className="text-xs font-medium text-blue-600">
                        {getPatientId(patient.patientId)}
                      </p>

                    </div>

                  </div>

                </div>

                {/* Patient information */}
                <div className="mt-5 space-y-3">

                  <div className="flex items-center gap-3 text-sm text-slate-600">

                    <Mail
                      size={17}
                      className="shrink-0 text-slate-400"
                    />

                    <span className="truncate">
                      {patient.email || "Email not available"}
                    </span>

                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-600">

                    <Phone
                      size={17}
                      className="shrink-0 text-slate-400"
                    />

                    <span>
                      {patient.phoneNumber || "Phone not available"}
                    </span>

                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-600">

                    <CalendarDays
                      size={17}
                      className="shrink-0 text-slate-400"
                    />

                    <span>
                      DOB:{" "}
                      {patient.dateOfBirth || "Not available"}
                    </span>

                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-600">

                    <UserRound
                      size={17}
                      className="shrink-0 text-slate-400"
                    />

                    <span>
                      {patient.gender || "Gender not available"}
                    </span>

                  </div>

                </div>

                {/* Action */}
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/doctor/patients/${patient.patientId}/history`
                    )
                  }
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Eye size={17} />
                  View Medical History
                </button>

              </article>

            ))}

          </div>
        )}

      </main>
    </div>
  );
}

export default DoctorPatients;