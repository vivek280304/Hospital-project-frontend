import { useEffect, useState } from "react";
import {
  X,
  FlaskConical,
  Loader2,
  CheckCircle,
  FileText,
  AlertCircle,
} from "lucide-react";

import doctorService from "../../services/doctorService";

export default function PatientLabReports({
  patientId,
  patientName,
  onClose,
}) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    loadReports();
  }, [patientId]);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await doctorService.getPatientHistory(patientId);

      setReports(response?.labResults || []);
    } catch (err) {
      console.error(
        "Failed to load patient lab reports:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load laboratory reports."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between border-b border-slate-200 p-5">

          <div>
            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <FlaskConical size={21} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Lab Reports
                </h2>

                <p className="text-sm text-slate-500">
                  {patientName}
                </p>
              </div>

            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={21} />
          </button>

        </div>

        {/* ================= BODY ================= */}

        <div className="flex-1 overflow-y-auto p-5">

          {/* Loading */}

          {loading && (
            <div className="flex flex-col items-center justify-center py-16">

              <Loader2
                size={34}
                className="animate-spin text-blue-600"
              />

              <p className="mt-3 text-sm text-slate-500">
                Loading laboratory reports...
              </p>

            </div>
          )}

          {/* Error */}

          {!loading && error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

              <AlertCircle size={19} />

              {error}

            </div>
          )}

          {/* No reports */}

          {!loading &&
            !error &&
            reports.length === 0 && (

              <div className="py-16 text-center">

                <FlaskConical
                  size={48}
                  className="mx-auto text-slate-300"
                />

                <h3 className="mt-4 font-semibold text-slate-700">
                  No completed lab reports
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  This patient has no completed laboratory results yet.
                </p>

              </div>
            )}

          {/* Reports */}

          {!loading &&
            !error &&
            reports.length > 0 && (

              <div className="space-y-4">

                {reports.map((report) => (

                  <div
                    key={report.orderId}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                      {/* Icon */}

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                        <FlaskConical size={22} />
                      </div>

                      {/* Details */}

                      <div className="min-w-0 flex-1">

                        <h3 className="font-bold text-slate-800">
                          {report.testName ||
                            "Laboratory Test"}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Sample:{" "}
                          {report.sampleType || "—"}
                        </p>

                        {report.createdAt && (
                          <p className="mt-1 text-xs text-slate-400">
                            Completed:{" "}
                            {new Date(
                              report.createdAt
                            ).toLocaleString()}
                          </p>
                        )}

                      </div>

                      {/* Status */}

                      <span className="flex w-fit items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">

                        <CheckCircle size={14} />

                        Completed

                      </span>

                    </div>

                    {/* View */}

                    <div className="mt-4 border-t border-slate-100 pt-4">

                      <button
                        onClick={() =>
                          setSelectedReport(report)
                        }
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >

                        <FileText size={17} />

                        View Result

                      </button>

                    </div>

                  </div>

                ))}

              </div>
            )}

        </div>

      </div>

      {/* ================================================= */}
      {/* RESULT DETAIL MODAL */}
      {/* ================================================= */}

      {selectedReport && (

        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-200 p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                  <FileText size={20} />
                </div>

                <div>

                  <h2 className="font-bold text-slate-800">
                    {selectedReport.testName ||
                      "Laboratory Result"}
                  </h2>

                  <p className="text-sm text-slate-500">
                    Patient: {patientName}
                  </p>

                </div>

              </div>

              <button
                onClick={() =>
                  setSelectedReport(null)
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* Result */}

            <div className="space-y-4 p-6">

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                <div className="mb-4 flex items-center gap-2">

                  <CheckCircle
                    size={19}
                    className="text-green-600"
                  />

                  <h3 className="font-bold text-slate-800">
                    Test Result
                  </h3>

                </div>

                <div className="whitespace-pre-wrap rounded-lg bg-white p-4 text-sm leading-7 text-slate-700">
                  {selectedReport.result ||
                    "No result available."}
                </div>

              </div>

              {/* Remarks */}

              {selectedReport.remarks && (

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">

                  <h3 className="font-semibold text-blue-800">
                    Laboratory Remarks
                  </h3>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-blue-700">
                    {selectedReport.remarks}
                  </p>

                </div>

              )}

              {/* Metadata */}

              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-lg bg-slate-50 p-3">

                  <p className="text-xs text-slate-400">
                    Sample Type
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedReport.sampleType ||
                      "—"}
                  </p>

                </div>

                <div className="rounded-lg bg-slate-50 p-3">

                  <p className="text-xs text-slate-400">
                    Order ID
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    #{selectedReport.orderId}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}