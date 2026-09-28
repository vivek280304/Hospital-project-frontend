import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Mail,
  Phone,
  UserRound,
  HeartPulse,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";

import doctorService from "../../services/doctorService";

function PatientDetails() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPatientDetails();
  }, [appointmentId]);

  const loadPatientDetails = async () => {
    try {
      setLoading(true);
      setError("");

      if (!appointmentId) {
        setError("Appointment ID is missing.");
        return;
      }

      const data = await doctorService.getPatientDetails(appointmentId);

      setPatient(data);
    } catch (err) {
      console.error("Patient details error:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Unable to load patient details."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(`${date}T12:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPatientId = () => {
    if (patient?.patientId != null) {
      return `P-${String(patient.patientId).padStart(5, "0")}`;
    }

    if (patient?.id != null) {
      return `P-${String(patient.id).padStart(5, "0")}`;
    }

    return "Not available";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="sticky top-0 z-30 flex h-[76px] items-center border-b border-slate-200 bg-white px-6 shadow-sm">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mr-4 rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
          >
            <ArrowLeft size={21} />
          </button>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Patient Details
            </h1>
            <p className="text-xs text-slate-500">
              Loading patient information...
            </p>
          </div>
        </header>

        <main className="flex min-h-[70vh] items-center justify-center p-6">
          <div className="flex flex-col items-center">
            <Loader2
              size={38}
              className="animate-spin text-blue-600"
            />

            <p className="mt-4 text-sm text-slate-500">
              Loading patient details...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="sticky top-0 z-30 flex h-[76px] items-center border-b border-slate-200 bg-white px-6 shadow-sm">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mr-4 rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
          >
            <ArrowLeft size={21} />
          </button>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Patient Details
            </h1>
          </div>
        </header>

        <main className="p-6">
          <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                <AlertCircle size={28} />
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                Unable to load patient
              </h2>

              <p className="mt-2 max-w-md text-sm text-slate-500">
                {error}
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={loadPatientDetails}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Retry
                </button>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="p-6">
          <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-slate-500">
              Patient information is not available.
            </p>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* HEADER */}
      <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mr-4 rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
          >
            <ArrowLeft size={21} />
          </button>

          <div>
            <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
              Patient Details
            </h1>

            <p className="text-xs text-slate-500 sm:text-sm">
              View patient information
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <HeartPulse size={21} />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-800">
              MediCare
            </p>

            <p className="text-xs text-slate-400">
              Doctor Portal
            </p>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="mx-auto max-w-6xl p-4 sm:p-6">
        {/* PATIENT HEADER */}
        <section className="mb-5 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20">
                <UserRound size={32} />
              </div>

              <div>
                <p className="text-sm text-blue-100">
                  Patient
                </p>

                <h2 className="text-2xl font-bold">
                  {patient.name || "Patient"}
                </h2>

                <p className="mt-1 text-sm text-blue-100">
                  Patient ID: {getPatientId()}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-white/10 px-5 py-3">
              <p className="text-xs text-blue-100">
                Appointment ID
              </p>

              <p className="mt-1 text-lg font-bold">
                #{appointmentId}
              </p>
            </div>
          </div>
        </section>

        {/* PERSONAL INFORMATION */}
        <section className="mb-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <UserRound size={20} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Personal Information
              </h3>

              <p className="text-xs text-slate-400">
                Patient basic information
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoCard
              icon={<UserRound size={18} />}
              label="Patient ID"
              value={getPatientId()}
            />

            <InfoCard
              icon={<CalendarDays size={18} />}
              label="Date of Birth"
              value={formatDate(patient.dateOfBirth)}
            />

            <InfoCard
              icon={<UserRound size={18} />}
              label="Gender"
              value={patient.gender || "Not available"}
            />

            <InfoCard
              icon={<Phone size={18} />}
              label="Phone Number"
              value={patient.phoneNumber || "Not available"}
            />

            <InfoCard
              icon={<Mail size={18} />}
              label="Email"
              value={patient.email || "Not available"}
            />

            <InfoCard
              icon={<HeartPulse size={18} />}
              label="Patient Status"
              value="Active"
            />
          </div>
        </section>

        {/* APPOINTMENT INFORMATION */}
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CalendarDays size={20} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Appointment Information
              </h3>

              <p className="text-xs text-slate-400">
                Appointment details
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <InfoCard
                icon={<FileText size={18} />}
                label="Appointment ID"
                value={`#${appointmentId}`}
              />

              <InfoCard
                icon={<CalendarDays size={18} />}
                label="Appointment Date"
                value={
                  patient.appointmentDate
                    ? formatDate(patient.appointmentDate)
                    : "From appointment"
                }
              />

              <InfoCard
                icon={<Clock size={18} />}
                label="Appointment Time"
                value={
                  patient.appointmentTime ||
                  "From appointment"
                }
              />

              <InfoCard
                icon={<HeartPulse size={18} />}
                label="Status"
                value={
                  patient.status ||
                  "Booked"
                }
              />
            </div>

            <div className="mt-5 border-t border-slate-200 pt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Reason for Visit
              </p>

              <div className="rounded-xl bg-white p-4 text-sm text-slate-700">
                {patient.reason || "No reason provided."}
              </div>
            </div>
          </div>
        </section>

        {/* ACTIONS */}
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                `/doctor/appointments/${appointmentId}/report`
              )
            }
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <FileText size={17} />
            Medical Report
          </button>
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   INFO CARD
============================================================ */

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-slate-800">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PatientDetails;