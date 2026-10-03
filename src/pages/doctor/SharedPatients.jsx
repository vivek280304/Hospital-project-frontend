import { useEffect, useState } from "react";
import {
  Eye,
  Users,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import doctorService from "../../services/doctorService";

export default function SharedPatients() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSharedPatients();
  }, []);

  const loadSharedPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await doctorService.getSharedPatients();

      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load shared patients:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load shared patients."
      );
    } finally {
      setLoading(false);
    }
  };

  const getSharedAt = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString();
  };

  return (
    <div className="min-h-full bg-slate-50 p-6">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Shared Patients
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Patients whose medical records have been shared with you.
          </p>
        </div>

        <button
          type="button"
          onClick={loadSharedPatients}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2
              size={22}
              className="animate-spin"
            />
            Loading shared patients...
          </div>
        </div>
      ) : patients.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Users
              size={28}
              className="text-slate-400"
            />
          </div>

          <h2 className="text-lg font-semibold text-slate-800">
            No Shared Patients
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            No doctor has shared a patient with you yet.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Patient ID
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Patient
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Shared By
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Shared At
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {patients.map((patient) => (
                  <tr
                    key={patient.shareId}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                      #{patient.patientId}
                    </td>

                    <td className="px-6 py-5">
                      <div className="font-semibold text-slate-900">
                        {patient.patientName || "Unknown Patient"}
                      </div>
                    </td>

                    {/* IMPORTANT: backend field is seniorDoctorName */}
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {patient.seniorDoctorName || "Unknown Doctor"}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-500">
                      {getSharedAt(patient.sharedAt)}
                    </td>

                    <td className="px-6 py-5 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/doctor/shared-patients/${patient.patientId}`
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        <Eye size={16} />
                        View Patient
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}