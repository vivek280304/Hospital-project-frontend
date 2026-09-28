import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  UserRound,
  History,
  Loader2,
  Users,
  Mail,
  Phone,
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

      if (Array.isArray(data)) {
        setPatients(data);
      } else if (Array.isArray(data?.patients)) {
        setPatients(data.patients);
      } else {
        setPatients([]);
      }
    } catch (err) {
      console.error(
        "Failed to load patients:",
        err
      );

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
  }, []);

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return patients;
    }

    return patients.filter((patient) => {
      const values = [
        patient.patientId,
        patient.id,
        patient.name,
        patient.patientName,
        patient.email,
        patient.phoneNumber,
        patient.phone,
      ];

      return values.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [patients, search]);

  const getPatientId = (patient) => {
    return (
      patient.patientId ??
      patient.id ??
      patient.userId
    );
  };

  const getPatientName = (patient) => {
    return (
      patient.patientName ??
      patient.name ??
      "Unknown Patient"
    );
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

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                My Patients
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                View your patients and their complete
                medical history.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Search */}
        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search patient by name, ID, email or phone..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </section>

        {/* Count */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">
              Total Patients
            </p>

            <p className="text-2xl font-bold text-slate-900">
              {filteredPatients.length}
            </p>
          </div>
        </div>

        {/* Table */}
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">
                    Patient
                  </th>

                  <th className="px-6 py-4">
                    Patient ID
                  </th>

                  <th className="px-6 py-4">
                    Contact
                  </th>

                  <th className="px-6 py-4">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-16 text-center"
                    >
                      <Loader2
                        size={28}
                        className="mx-auto animate-spin text-blue-600"
                      />

                      <p className="mt-3 text-sm text-slate-500">
                        Loading patients...
                      </p>
                    </td>
                  </tr>
                ) : filteredPatients.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-16 text-center"
                    >
                      <Users
                        size={32}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-3 text-sm text-slate-500">
                        No patients found.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map(
                    (patient, index) => {
                      const patientId =
                        getPatientId(patient);

                      return (
                        <tr
                          key={
                            patientId ?? index
                          }
                          className="border-t border-slate-100 hover:bg-slate-50"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                <UserRound
                                  size={20}
                                />
                              </div>

                              <div>
                                <p className="font-semibold text-slate-800">
                                  {getPatientName(
                                    patient
                                  )}
                                </p>

                                <p className="text-xs text-slate-400">
                                  Patient
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-600">
                            {patientId != null
                              ? `P-${String(
                                  patientId
                                ).padStart(5, "0")}`
                              : "—"}
                          </td>

                          <td className="px-6 py-5">
                            <div className="space-y-1">
                              {patient.email && (
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <Mail
                                    size={14}
                                  />
                                  {patient.email}
                                </div>
                              )}

                              {(patient.phoneNumber ||
                                patient.phone) && (
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <Phone
                                    size={14}
                                  />
                                  {patient.phoneNumber ||
                                    patient.phone}
                                </div>
                              )}

                              {!patient.email &&
                                !patient.phoneNumber &&
                                !patient.phone && (
                                  <span className="text-sm text-slate-400">
                                    —
                                  </span>
                                )}
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <button
                              type="button"
                              disabled={
                                patientId == null
                              }
                              onClick={() =>
                                navigate(
                                  `/doctor/patients/${patientId}/history`
                                )
                              }
                              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <History
                                size={16}
                              />
                              History
                            </button>
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

export default DoctorPatients;