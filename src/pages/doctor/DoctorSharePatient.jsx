import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  UserRound,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

import doctorService from "../../services/doctorService";

export default function DoctorSharePatient() {
  const navigate = useNavigate();
  const { patientId } = useParams();

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");

  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
  try {
    setLoading(true);
    setError("");

    // Get all doctors + logged-in doctor's profile
    const [doctorsData, profileData] = await Promise.all([
      doctorService.getDoctors(),
      doctorService.getProfile(),
    ]);

    // Current logged-in doctor ID
    const currentDoctorId =
      profileData?.doctorId ??
      profileData?.id;

    console.log("Current Doctor ID:", currentDoctorId);
    console.log("All Doctors:", doctorsData);

    // Remove logged-in doctor from the list
    const otherDoctors = (Array.isArray(doctorsData) ? doctorsData : [])
      .filter((doctor) => {
        const doctorId = doctor.id ?? doctor.doctorId;

        return Number(doctorId) !== Number(currentDoctorId);
      });

    setDoctors(otherDoctors);

  } catch (err) {
    console.error("Doctor loading error:", err);

    setError(
      err?.response?.data?.message ||
      err?.response?.data ||
      "Unable to load doctors."
    );
  } finally {
    setLoading(false);
  }
};

  const handleShare = async () => {
    if (!selectedDoctorId) {
      setError("Please select a doctor.");
      return;
    }

    if (!patientId) {
      setError("Patient ID is missing.");
      return;
    }

    try {
      setSharing(true);
      setError("");
      setSuccess("");

      /*
       * IMPORTANT:
       * This assumes SharePatientRequest contains doctorId.
       */
      await doctorService.sharePatient(
        Number(patientId),
        {
          doctorId: Number(selectedDoctorId),
        }
      );

      setSuccess(
        "Patient reports shared successfully."
      );

      setTimeout(() => {
        navigate("/doctor/patients");
      }, 1500);

    } catch (err) {
      console.error("Share patient error:", err);

      const data = err?.response?.data;

      setError(
        data?.message ||
        data?.error ||
        (typeof data === "string"
          ? data
          : "Unable to share patient.")
      );
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-[76px] max-w-5xl items-center px-4 sm:px-6">

          <button
            type="button"
            onClick={() =>
              navigate("/doctor/patients")
            }
            className="mr-4 rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft size={21} />
          </button>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Share Patient
            </h1>

            <p className="text-sm text-slate-500">
              Share this patient's reports with another doctor
            </p>
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-3xl p-4 sm:p-6">

        {/* HEADER CARD */}
        <section className="mb-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-sm">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">
              <Share2 size={28} />
            </div>

            <div>
              <p className="text-sm text-blue-100">
                Patient Sharing
              </p>

              <h2 className="text-2xl font-bold">
                Share Medical Records
              </h2>

              <p className="mt-1 text-sm text-blue-100">
                Select a doctor who should have access to this patient's shared reports.
              </p>
            </div>

          </div>

        </section>

        {/* PATIENT */}
        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <UserRound size={26} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Patient ID
              </p>

              <p className="text-lg font-bold text-slate-900">
                P-{String(patientId).padStart(5, "0")}
              </p>
            </div>

          </div>

        </section>

        {/* ERROR */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-medium">
              {error}
            </p>
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-medium">
              {success}
            </p>
          </div>
        )}

        {/* DOCTORS */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 p-5">
            <h3 className="font-bold text-slate-900">
              Select Doctor
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Choose the doctor who should receive access.
            </p>
          </div>

          <div className="p-5">

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">

                <Loader2
                  size={32}
                  className="animate-spin text-blue-600"
                />

                <p className="mt-3 text-sm text-slate-500">
                  Loading doctors...
                </p>

              </div>
            ) : doctors.length === 0 ? (
              <div className="py-10 text-center">

                <Stethoscope
                  size={35}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 font-semibold text-slate-600">
                  No doctors available
                </p>

              </div>
            ) : (
              <div className="space-y-3">

                {doctors.map((doctor) => {

                  const id =
                    doctor.id ??
                    doctor.doctorId;

                  const name =
                    doctor.name ??
                    doctor.doctorName ??
                    "Doctor";

                  const specialization =
                    doctor.specialization ??
                    "General";

                  const selected =
                    String(id) ===
                    String(selectedDoctorId);

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() =>
                        setSelectedDoctorId(
                          String(id)
                        )
                      }
                      className={`w-full rounded-xl border p-4 text-left transition ${
                        selected
                          ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                          : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                      }`}
                    >

                      <div className="flex items-center gap-4">

                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full font-bold ${
                            selected
                              ? "bg-blue-600 text-white"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="flex-1">

                          <p className="font-bold text-slate-900">
                            {name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {specialization}
                          </p>

                        </div>

                        {selected && (
                          <CheckCircle2
                            size={21}
                            className="text-blue-600"
                          />
                        )}

                      </div>

                    </button>
                  );
                })}

              </div>
            )}

            {/* SHARE BUTTON */}
            <button
              type="button"
              onClick={handleShare}
              disabled={
                sharing ||
                !selectedDoctorId ||
                loading
              }
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {sharing ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Sharing Patient...
                </>
              ) : (
                <>
                  <Share2 size={18} />
                  Share Patient
                </>
              )}
            </button>

          </div>

        </section>

      </main>
    </div>
  );
}