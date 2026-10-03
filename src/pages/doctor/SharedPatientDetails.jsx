import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  CalendarDays,
  UserRound,
  FlaskConical,
  Clock3,
  Activity,
  ChevronRight,
  Stethoscope,
  ClipboardList,
} from "lucide-react";

import doctorService from "../../services/doctorService";

export default function SharedPatientDetails() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [imaging, setImaging] = useState([]);
  const [labResults, setLabResults] = useState([]);

  const [labLoading, setLabLoading] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingImaging, setLoadingImaging] = useState(true);

  const [errorReports, setErrorReports] = useState("");
  const [errorImaging, setErrorImaging] = useState("");

  useEffect(() => {
    if (!patientId) return;

    loadReports();
    loadImaging();
    loadLabResults();
  }, [patientId]);

  const loadReports = async () => {
    try {
      setLoadingReports(true);
      setErrorReports("");

      const data =
        await doctorService.getSharedPatientReports(patientId);

      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load shared reports:", err);

      setErrorReports(
        err?.response?.data?.message ||
          "Unable to load medical reports."
      );
    } finally {
      setLoadingReports(false);
    }
  };

  const loadLabResults = async () => {
    try {
      setLabLoading(true);

      const data =
        await doctorService.getSharedPatientLabResults(patientId);

      setLabResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Failed to load shared patient lab results:",
        error
      );

      setLabResults([]);
    } finally {
      setLabLoading(false);
    }
  };

  const loadImaging = async () => {
    try {
      setLoadingImaging(true);
      setErrorImaging("");

      const data =
        await doctorService.getSharedPatientImaging(patientId);

      setImaging(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load shared imaging:", err);

      setErrorImaging(
        err?.response?.data?.message ||
          "Unable to load imaging."
      );
    } finally {
      setLoadingImaging(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-full bg-[#f5f8fc]">

      {/* =====================================================
          TOP HEADER
      ===================================================== */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">

          <button
            type="button"
            onClick={() =>
              navigate("/doctor/shared-patients")
            }
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Shared Patients
          </button>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                <UserRound size={30} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Patient #{patientId}
                  </h1>

                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    Shared Patient
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Patient ID: #{patientId}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">

              <SummaryStat
                icon={<FileText size={17} />}
                value={reports.length}
                label="Reports"
              />

              <SummaryStat
                icon={<FlaskConical size={17} />}
                value={labResults.length}
                label="Lab Results"
              />

              <SummaryStat
                icon={<ImageIcon size={17} />}
                value={imaging.length}
                label="Imaging"
              />

            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}
      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Quick navigation */}
        <div className="mb-8 flex flex-wrap gap-2">

          <SectionButton
            icon={<FileText size={16} />}
            label="Medical Reports"
            count={reports.length}
            href="#reports"
          />

          <SectionButton
            icon={<FlaskConical size={16} />}
            label="Lab Results"
            count={labResults.length}
            href="#labs"
          />

          <SectionButton
            icon={<ImageIcon size={16} />}
            label="Imaging"
            count={imaging.length}
            href="#imaging"
          />

        </div>

        {/* =====================================================
            MEDICAL REPORTS
        ===================================================== */}
        <section id="reports" className="mb-10">

          <SectionHeader
            icon={<FileText size={21} />}
            title="Medical Reports"
            description="Clinical reports and consultation records shared by the senior doctor."
            color="blue"
            count={reports.length}
          />

          {loadingReports ? (
            <Loading />
          ) : errorReports ? (
            <ErrorMessage message={errorReports} />
          ) : reports.length === 0 ? (
            <Empty
              icon={<FileText size={25} />}
              message="No medical reports available."
            />
          ) : (
            <div className="space-y-5">

              {reports.map((report, index) => (
                <div
                  key={report.id ?? index}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >

                  {/* Report top */}
                  <div className="border-b border-slate-100 px-6 py-5">

                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <ClipboardList size={20} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">
                            Medical Report
                          </h3>

                          <p className="mt-0.5 text-xs text-slate-500">
                            Report #{report.id}
                          </p>
                        </div>

                      </div>

                      <div className="flex flex-wrap gap-2">

                        <InfoBadge
                          icon={<CalendarDays size={14} />}
                          text={formatDate(
                            report.appointmentDate
                          )}
                        />

                        {report.appointmentTime && (
                          <InfoBadge
                            icon={<Clock3 size={14} />}
                            text={report.appointmentTime}
                          />
                        )}

                        <span className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                          Completed
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* Report fields */}
                  <div className="grid gap-px bg-slate-100 md:grid-cols-2">

                    <ClinicalField
                      title="Diagnosis"
                      value={report.diagnosis}
                      icon={<Activity size={16} />}
                    />

                    <ClinicalField
                      title="Symptoms"
                      value={report.symptoms}
                    />

                    <ClinicalField
                      title="Treatment"
                      value={report.treatment}
                    />

                    <ClinicalField
                      title="Prescription"
                      value={report.prescription}
                    />

                    <div className="md:col-span-2">
                      <ClinicalField
                        title="Doctor Notes"
                        value={report.notes}
                      />
                    </div>

                  </div>

                  {/* Doctor */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                        <Stethoscope size={17} />
                      </div>

                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                          Treated by
                        </p>

                        <p className="text-sm font-semibold text-slate-800">
                          {report.doctorName ||
                            "Unknown Doctor"}
                        </p>
                      </div>

                    </div>

                    <p className="text-xs text-slate-400">
                      Created {formatDateTime(report.createdAt)}
                    </p>

                  </div>

                </div>
              ))}

            </div>
          )}
        </section>

        {/* =====================================================
            LAB RESULTS
        ===================================================== */}
        <section id="labs" className="mb-10">

          <SectionHeader
            icon={<FlaskConical size={21} />}
            title="Laboratory Results"
            description="Completed diagnostic tests and laboratory findings."
            color="emerald"
            count={labResults.length}
          />

          {labLoading ? (
            <Loading />
          ) : labResults.length === 0 ? (
            <Empty
              icon={<FlaskConical size={25} />}
              message="No completed lab results available."
            />
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">

              {labResults.map((lab) => (
                <div
                  key={lab.orderId}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >

                  {/* Lab header */}
                  <div className="border-b border-slate-100 px-6 py-5">

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                          <FlaskConical size={20} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {lab.testName ||
                              "Laboratory Test"}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            Order #{lab.orderId}
                          </p>
                        </div>

                      </div>

                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        Completed
                      </span>

                    </div>

                  </div>

                  {/* Lab metadata */}
                  <div className="grid grid-cols-2 border-b border-slate-100">

                    <div className="border-r border-slate-100 px-6 py-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Sample
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {lab.sampleType || "N/A"}
                      </p>
                    </div>

                    <div className="px-6 py-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Completed
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {lab.completedAt
                          ? formatDateTime(
                              lab.completedAt
                            )
                          : "N/A"}
                      </p>
                    </div>

                  </div>

                  {/* Result */}
                  <div className="p-6">

                    <div className="mb-5">

                      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                        Result
                      </p>

                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                          {lab.result ||
                            "No result provided"}
                        </p>
                      </div>

                    </div>

                    <div>

                      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                        Remarks
                      </p>

                      <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                          {lab.remarks ||
                            "No remarks provided"}
                        </p>
                      </div>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}
        </section>

        {/* =====================================================
            IMAGING
        ===================================================== */}
        <section id="imaging">

          <SectionHeader
            icon={<ImageIcon size={21} />}
            title="Diagnostic Imaging"
            description="X-rays, CT scans, MRI and other diagnostic images."
            color="violet"
            count={imaging.length}
          />

          {loadingImaging ? (
            <Loading />
          ) : errorImaging ? (
            <ErrorMessage message={errorImaging} />
          ) : imaging.length === 0 ? (
            <Empty
              icon={<ImageIcon size={25} />}
              message="No imaging available."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {imaging.map((image, index) => (
                <div
                  key={image.id ?? index}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >

                  <div className="relative flex h-52 items-center justify-center overflow-hidden bg-slate-100">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm">
                      <ImageIcon size={32} />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/40 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                      <span className="text-xs font-medium text-white">
                        Diagnostic Image
                      </span>
                    </div>

                  </div>

                  <div className="p-5">

                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <h3 className="line-clamp-2 font-semibold text-slate-900">
                          {image.fileName ||
                            image.imageName ||
                            image.testName ||
                            "Diagnostic Image"}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {image.contentType ||
                            "Medical imaging"}
                        </p>
                      </div>

                      <ChevronRight
                        size={18}
                        className="mt-1 shrink-0 text-slate-300"
                      />

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}


/* ============================================================
   SUMMARY STAT
============================================================ */

function SummaryStat({ icon, value, label }) {
  return (
    <div className="hidden min-w-[105px] rounded-xl border border-slate-200 bg-white px-4 py-3 sm:block">

      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-[11px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-1 text-xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}


/* ============================================================
   SECTION BUTTON
============================================================ */

function SectionButton({
  icon,
  label,
  count,
  href,
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
    >
      {icon}

      {label}

      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
        {count}
      </span>
    </a>
  );
}


/* ============================================================
   SECTION HEADER
============================================================ */

function SectionHeader({
  icon,
  title,
  description,
  count,
  color,
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="mb-5 flex items-center justify-between gap-4">

      <div className="flex items-center gap-3">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles[color]}`}
        >
          {icon}
        </div>

        <div>
          <div className="flex items-center gap-2">

            <h2 className="text-lg font-bold text-slate-900">
              {title}
            </h2>

            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
              {count}
            </span>

          </div>

          <p className="mt-0.5 text-sm text-slate-500">
            {description}
          </p>
        </div>

      </div>

    </div>
  );
}


/* ============================================================
   CLINICAL FIELD
============================================================ */

function ClinicalField({
  title,
  value,
  icon,
}) {
  return (
    <div className="bg-white p-5">

      <div className="mb-2 flex items-center gap-2">

        {icon && (
          <span className="text-blue-500">
            {icon}
          </span>
        )}

        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
          {title}
        </p>

      </div>

      <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
        {value || "No information provided."}
      </p>

    </div>
  );
}


/* ============================================================
   INFO BADGE
============================================================ */

function InfoBadge({ icon, text }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
      {icon}
      {text}
    </div>
  );
}


/* ============================================================
   LOADING
============================================================ */

function Loading() {
  return (
    <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-slate-200 bg-white">

      <div className="flex items-center gap-3 text-sm text-slate-500">

        <Loader2
          size={20}
          className="animate-spin text-blue-600"
        />

        Loading records...

      </div>

    </div>
  );
}


/* ============================================================
   EMPTY
============================================================ */

function Empty({ message, icon }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">

      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        {icon}
      </div>

      <p className="text-sm font-medium text-slate-500">
        {message}
      </p>

    </div>
  );
}


/* ============================================================
   ERROR
============================================================ */

function ErrorMessage({ message }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

      <AlertCircle size={18} />

      <span>{message}</span>

    </div>
  );
}