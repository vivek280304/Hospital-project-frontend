import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  FileText,
  UserRound,
  Phone,
  Mail,
  Image as ImageIcon,
  FlaskConical,
  Loader2,
  AlertCircle,
  Eye,
  X,
} from "lucide-react";

import doctorService from "../../services/doctorService";

function PatientHistory() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Lab report modal
  const [selectedLabReport, setSelectedLabReport] = useState(null);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await doctorService.getPatientHistory(patientId);

      setHistory(data);
    } catch (err) {
      console.error("Failed to load patient history:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load patient history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [patientId]);

  /*
   * Backend history response
   */
  const patient = history?.patient || {};

  const appointments =
    history?.appointments ||
    history?.appointmentHistory ||
    [];

  const reports =
    history?.medicalReports ||
    history?.reports ||
    [];

  const labResults =
    history?.labResults ||
    [];

  const imaging =
    history?.imaging ||
    history?.images ||
    [];

  /*
   * Format date
   */
  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /*
   * Format time
   */
  const formatTime = (time) => {
    if (!time) return "N/A";

    const [hours, minutes] = String(time).split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /*
   * Format date + time
   */
  const formatDateTime = (value) => {
    if (!value) return "N/A";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /*
   * Appointment status styling
   */
  const getStatusClass = (status) => {
    switch (
      String(status || "").toUpperCase()
    ) {
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-600";

      case "BOOKED":
        return "bg-blue-50 text-blue-600";

      case "CANCELLED":
        return "bg-red-50 text-red-600";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2
            size={36}
            className="mx-auto animate-spin text-blue-600"
          />

          <p className="mt-3 text-sm text-slate-500">
            Loading patient history...
          </p>
        </div>
      </div>
    );
  }

  /*
   * Error
   */
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() =>
              navigate("/doctor/patients")
            }
            className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            My Patients
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle size={22} />

              <div>
                <h2 className="font-semibold">
                  Unable to load history
                </h2>

                <p className="mt-1 text-sm">
                  {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">

          <button
            type="button"
            onClick={() =>
              navigate("/doctor/patients")
            }
            className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            My Patients
          </button>

          <h1 className="text-2xl font-bold text-slate-900">
            Patient History
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Complete medical history of the patient.
          </p>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">

        {/* =================================================
            PATIENT INFORMATION
        ================================================== */}
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">

          <SectionHeader
            icon={<UserRound size={21} />}
            title="Patient Information"
            subtitle="Personal details"
          />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            <Info
              label="Patient ID"
              value={
                patient.id ??
                patient.patientId ??
                patientId
              }
            />

            <Info
              label="Name"
              value={
                patient.name ??
                patient.patientName ??
                "N/A"
              }
            />

            <Info
              label="Email"
              value={patient.email}
              icon={<Mail size={15} />}
            />

            <Info
              label="Phone"
              value={
                patient.phoneNumber ??
                patient.phone
              }
              icon={<Phone size={15} />}
            />

            <Info
              label="Date of Birth"
              value={formatDate(
                patient.dateOfBirth
              )}
            />

            <Info
              label="Gender"
              value={patient.gender}
            />

          </div>
        </section>

        {/* =================================================
            APPOINTMENT HISTORY
        ================================================== */}
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">

          <SectionHeader
            icon={<CalendarDays size={21} />}
            title="Appointment History"
            subtitle={`${appointments.length} appointment(s)`}
          />

          {appointments.length === 0 ? (
            <Empty
              icon={<CalendarDays size={28} />}
              text="No appointment history found."
            />
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[750px]">

                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                    <th className="px-4 py-3">
                      Date
                    </th>

                    <th className="px-4 py-3">
                      Time
                    </th>

                    <th className="px-4 py-3">
                      Reason
                    </th>

                    <th className="px-4 py-3">
                      Status
                    </th>

                    <th className="px-4 py-3 text-right">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {appointments.map(
                    (appointment, index) => (

                      <tr
                        key={
                          appointment.appointmentId ??
                          appointment.id ??
                          index
                        }
                        className="border-b border-slate-50"
                      >

                        {/* DATE */}
                        <td className="px-4 py-4 text-sm text-slate-700">
                          {formatDate(
                            appointment.appointmentDate
                          )}
                        </td>

                        {/* TIME */}
                        <td className="px-4 py-4">

                          <div className="flex items-center gap-2 text-sm text-slate-700">

                            <Clock3
                              size={15}
                              className="text-blue-500"
                            />

                            {formatTime(
                              appointment.appointmentTime
                            )}

                          </div>

                        </td>

                        {/* REASON */}
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {appointment.reason ||
                            "General consultation"}
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              appointment.status
                            )}`}
                          >
                            {appointment.status ||
                              "N/A"}
                          </span>

                        </td>

                        {/* ACTION */}
                        <td className="px-4 py-4 text-right">

                          {String(
                            appointment.status || ""
                          ).toUpperCase() ===
                            "COMPLETED" && (

                            <button
                              type="button"
                              onClick={() => {

                                const report =
                                  reports.find(
                                    (item) =>
                                      Number(
                                        item.appointmentId
                                      ) ===
                                      Number(
                                        appointment.appointmentId ??
                                          appointment.id
                                      )
                                  );

                                navigate(
                                  `/doctor/appointments/${
                                    appointment.appointmentId ??
                                    appointment.id
                                  }/report`,
                                  {
                                    state: {
                                      patientId,
                                      appointment,
                                      report:
                                        report || null,
                                    },
                                  }
                                );
                              }}
                              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                            >
                              <FileText size={15} />

                              Medical Report
                            </button>

                          )}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

        {/* =================================================
            LAB REPORTS
        ================================================== */}
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">

          <SectionHeader
            icon={<FlaskConical size={21} />}
            title="Lab Reports"
            subtitle={`${labResults.length} completed lab report(s)`}
          />

          {labResults.length === 0 ? (

            <Empty
              icon={<FlaskConical size={28} />}
              text="No completed lab reports found."
            />

          ) : (

            <div className="space-y-4">

              {labResults.map(
                (lab, index) => (

                  <div
                    key={
                      lab.orderId ??
                      lab.id ??
                      index
                    }
                    className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                  >

                    {/* TOP */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                      <div className="flex items-start gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                          <FlaskConical size={20} />
                        </div>

                        <div>

                          <h3 className="font-bold text-slate-800">
                            {lab.testName ||
                              "Laboratory Test"}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            Sample:{" "}
                            {lab.sampleType ||
                              "N/A"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Order ID:{" "}
                            {lab.orderId ??
                              "N/A"}
                          </p>

                        </div>

                      </div>

                      <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                        COMPLETED
                      </span>

                    </div>

                    {/* RESULT PREVIEW */}
                    <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">

                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Result
                      </p>

                      <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {lab.result ||
                          "No result available."}
                      </p>

                    </div>

                    {/* REMARKS */}
                    {lab.remarks && (

                      <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">

                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Remarks
                        </p>

                        <p className="line-clamp-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                          {lab.remarks}
                        </p>

                      </div>

                    )}

                    {/* BOTTOM */}
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex items-center gap-2 text-xs text-slate-400">

                        <Clock3 size={14} />

                        <span>
                          Completed:{" "}
                          {formatDateTime(
                            lab.completedAt ||
                              lab.createdAt
                          )}
                        </span>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedLabReport(
                            lab
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                      >
                        <Eye size={15} />

                        View Full Report
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        {/* =================================================
            IMAGING
        ================================================== */}
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">

          <SectionHeader
            icon={<ImageIcon size={21} />}
            title="Tests & Imaging"
            subtitle={`${imaging.length} record(s)`}
          />

          {imaging.length === 0 ? (

            <Empty
              icon={<ImageIcon size={28} />}
              text="No tests or imaging records found."
            />

          ) : (

            <div className="grid gap-4 md:grid-cols-2">

              {imaging.map(
                (item, index) => (

                  <div
                    key={
                      item.orderId ??
                      item.imageId ??
                      item.id ??
                      index
                    }
                    className="rounded-xl border border-slate-100 bg-slate-50 p-5"
                  >

                    <div className="flex items-start gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <ImageIcon size={19} />
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="font-semibold text-slate-800">
                          {item.imagingType ??
                            item.type ??
                            item.name ??
                            "Imaging"}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Status:{" "}
                          {item.status || "N/A"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {formatDateTime(
                            item.createdAt
                          )}
                        </p>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>

      {/* =====================================================
          LAB REPORT MODAL
      ====================================================== */}
      {selectedLabReport && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() =>
            setSelectedLabReport(null)
          }
        >

          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <FlaskConical size={21} />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    {selectedLabReport.testName ||
                      "Laboratory Report"}
                  </h2>

                  <p className="text-xs text-slate-500">
                    Order ID:{" "}
                    {selectedLabReport.orderId ??
                      "N/A"}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedLabReport(null)
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>

            {/* MODAL CONTENT */}
            <div className="space-y-5 p-6">

              {/* SUMMARY */}
              <div className="grid gap-4 sm:grid-cols-3">

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Test
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedLabReport.testName ||
                      "N/A"}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Sample
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedLabReport.sampleType ||
                      "N/A"}
                  </p>

                </div>

                <div className="rounded-xl bg-emerald-50 p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                    Status
                  </p>

                  <p className="mt-1 font-semibold text-emerald-700">
                    COMPLETED
                  </p>

                </div>

              </div>

              {/* RESULT */}
              <div>

                <div className="mb-2 flex items-center justify-between">

                  <h3 className="text-sm font-bold text-slate-900">
                    Test Result
                  </h3>

                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {selectedLabReport.result ||
                      "No result available."}
                  </p>

                </div>

              </div>

              {/* REMARKS */}
              <div>

                <h3 className="mb-2 text-sm font-bold text-slate-900">
                  Laboratory Remarks
                </h3>

                <div className="rounded-xl border border-slate-200 bg-white p-5">

                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {selectedLabReport.remarks ||
                      "No remarks provided."}
                  </p>

                </div>

              </div>

              {/* COMPLETED DATE */}
              <div className="flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-400">

                <Clock3 size={14} />

                <span>
                  Completed:{" "}
                  {formatDateTime(
                    selectedLabReport.completedAt ||
                      selectedLabReport.createdAt
                  )}
                </span>

              </div>

            </div>

            {/* MODAL FOOTER */}
            <div className="flex justify-end border-t border-slate-200 px-6 py-4">

              <button
                type="button"
                onClick={() =>
                  setSelectedLabReport(null)
                }
                className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  icon,
  title,
  subtitle,
}) {
  return (
    <div className="mb-5 flex items-center gap-3">

      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div>

        <h2 className="font-bold text-slate-900">
          {title}
        </h2>

        <p className="text-xs text-slate-400">
          {subtitle}
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   INFO
========================================================= */

function Info({
  label,
  value,
  icon,
}) {
  return (
    <div>

      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">

        {icon}

        {value || "N/A"}

      </div>

    </div>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function Empty({
  icon,
  text,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 py-10 text-center">

      <div className="text-slate-300">
        {icon}
      </div>

      <p className="mt-3 text-sm text-slate-400">
        {text}
      </p>

    </div>
  );
}

export default PatientHistory;