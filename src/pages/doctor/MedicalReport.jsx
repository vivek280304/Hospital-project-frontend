import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
  Save,
  AlertCircle,
} from "lucide-react";

import doctorService from "../../services/doctorService";

function MedicalReport() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const appointment = location.state?.appointment || null;
  const initialReport = location.state?.report || null;

  const [report, setReport] = useState(initialReport);

  const [form, setForm] = useState({
    diagnosis: initialReport?.diagnosis || "",
    symptoms: initialReport?.symptoms || "",
    treatment: initialReport?.treatment || "",
    prescription: initialReport?.prescription || "",
    notes: initialReport?.notes || "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.diagnosis.trim()) {
      setError("Diagnosis is required.");
      return;
    }

    if (!appointmentId) {
      setError("Appointment ID is missing.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        diagnosis: form.diagnosis.trim(),
        symptoms: form.symptoms.trim(),
        treatment: form.treatment.trim(),
        prescription: form.prescription.trim(),
        notes: form.notes.trim(),
      };

      const savedReport =
        await doctorService.createMedicalReport(
          appointmentId,
          payload
        );

      setReport(savedReport);
      setSuccess("Medical report saved successfully.");
    } catch (err) {
      console.error("Failed to save medical report:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to save medical report."
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "N/A";

    const [hours, minutes] = String(time).split(":");
    const date = new Date();

    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6">
          <button
            type="button"
            onClick={() =>
              navigate(
                patientIdFromLocation(location.state)
                  ? `/doctor/patients/${patientIdFromLocation(
                      location.state
                    )}/history`
                  : "/doctor/patients"
              )
            }
            className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Patient History
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Medical Report
              </h1>

              <p className="text-sm text-slate-500">
                Appointment ID: {appointmentId}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-5 px-4 py-6 sm:px-6">
        {appointment && (
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-3">
              <Info
                label="Patient"
                value={
                  appointment.patientName || "Patient"
                }
              />

              <Info
                label="Appointment Date"
                value={formatDate(appointment.appointmentDate)}
              />

              <Info
                label="Appointment Time"
                value={formatTime(appointment.appointmentTime)}
              />
            </div>
          </section>
        )}

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 size={19} />
            {success}
          </div>
        )}

        {report ? (
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Saved Medical Report
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  This report belongs to appointment #{appointmentId}.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                <CheckCircle2 size={15} />
                Saved
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <ReportItem
                label="Diagnosis"
                value={report.diagnosis}
              />

              <ReportItem
                label="Symptoms"
                value={report.symptoms}
              />

              <ReportItem
                label="Treatment"
                value={report.treatment}
              />

              <ReportItem
                label="Prescription"
                value={report.prescription}
              />

              <div className="md:col-span-2">
                <ReportItem
                  label="Notes"
                  value={report.notes}
                />
              </div>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    patientIdFromLocation(location.state)
                      ? `/doctor/patients/${patientIdFromLocation(
                          location.state
                        )}/history`
                      : "/doctor/patients"
                  )
                }
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Back to Patient History
              </button>
            </div>
          </section>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="mb-7">
              <h2 className="text-lg font-bold text-slate-900">
                Write Medical Report
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter the report for this appointment and save it.
              </p>
            </div>

            <div className="space-y-6">
              <Field
                label="Diagnosis"
                name="diagnosis"
                value={form.diagnosis}
                onChange={handleChange}
                placeholder="Enter diagnosis"
                required
              />

              <Field
                label="Symptoms"
                name="symptoms"
                value={form.symptoms}
                onChange={handleChange}
                placeholder="Enter patient symptoms"
                textarea
              />

              <Field
                label="Treatment"
                name="treatment"
                value={form.treatment}
                onChange={handleChange}
                placeholder="Enter treatment provided"
                textarea
              />

              <Field
                label="Prescription"
                name="prescription"
                value={form.prescription}
                onChange={handleChange}
                placeholder="Enter prescription"
                textarea
              />

              <Field
                label="Notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Additional notes"
                textarea
              />
            </div>

            <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Medical Report
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

function patientIdFromLocation(state) {
  return state?.patientId || null;
}

function Info({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-700">
        {value || "N/A"}
      </p>
    </div>
  );
}

function ReportItem({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
        {value || "N/A"}
      </p>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  textarea = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      )}
    </div>
  );
}

export default MedicalReport;
