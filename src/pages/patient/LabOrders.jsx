import { useEffect, useState } from "react";
import {
  FlaskConical,
  Loader2,
  RefreshCw,
  CheckCircle,
  Clock,
  TestTube,
  Search,
  X,
  FileText,
} from "lucide-react";

import patientService from "../../services/patientService";

export default function LabOrders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedResult, setSelectedResult] = useState(null);
  const [resultLoading, setResultLoading] = useState(false);
  const [resultError, setResultError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);

      const response = await patientService.getLabOrders();

      setData(
        Array.isArray(response)
          ? response
          : response?.data || []
      );
    } catch (error) {
      console.error("Failed to load lab orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const viewResult = async (orderId) => {
    try {
      setResultLoading(true);
      setResultError("");

      const result =
        await patientService.getLabResult(orderId);

      setSelectedResult(result);
    } catch (error) {
      console.error("Failed to load result:", error);

      setResultError(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to load test result."
      );
    } finally {
      setResultLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "ORDERED":
        return "bg-yellow-100 text-yellow-700";

      case "CLAIMED":
        return "bg-blue-100 text-blue-700";

      case "SAMPLE_COLLECTED":
        return "bg-purple-100 text-purple-700";

      case "PROCESSING":
        return "bg-orange-100 text-orange-700";

      case "COMPLETED":
        return "bg-green-100 text-green-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle size={16} />;

      case "PROCESSING":
        return <Loader2 size={16} />;

      case "SAMPLE_COLLECTED":
        return <TestTube size={16} />;

      default:
        return <Clock size={16} />;
    }
  };

  const filteredOrders = data.filter((order) =>
    `${order.testName || ""} ${order.status || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl">

      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            My Lab Orders
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Track your laboratory tests and results
          </p>
        </div>

        <button
          onClick={loadOrders}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>

      </div>

      {/* SEARCH */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lab test..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
          />

        </div>

      </div>

      {/* ORDERS */}
      {loading ? (

        <div className="flex justify-center py-16">
          <Loader2
            size={30}
            className="animate-spin text-blue-600"
          />
        </div>

      ) : filteredOrders.length === 0 ? (

        <div className="rounded-2xl border border-slate-200 bg-white py-14 text-center">

          <FlaskConical
            size={42}
            className="mx-auto text-slate-300"
          />

          <p className="mt-4 text-sm text-slate-400">
            No lab orders found.
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {filteredOrders.map((order) => (

            <div
              key={order.orderId}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >

              <div className="flex flex-col gap-4 md:flex-row md:items-center">

                {/* ICON */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <FlaskConical size={22} />
                </div>

                {/* DETAILS */}
                <div className="min-w-0 flex-1">

                  <h2 className="font-bold text-slate-800">
                    {order.testName || "Laboratory Test"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Order #{order.orderId}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">

                    {order.sampleType && (
                      <span>
                        Sample: {order.sampleType}
                      </span>
                    )}

                    {order.scheduledDate && (
                      <span>
                        Date: {order.scheduledDate}
                      </span>
                    )}

                    {order.scheduledTime && (
                      <span>
                        Time: {order.scheduledTime}
                      </span>
                    )}

                  </div>

                </div>

                {/* STATUS */}
                <div
                  className={`flex items-center gap-2 self-start rounded-full px-3 py-2 text-xs font-semibold md:self-center ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {getStatusIcon(order.status)}

                  {order.status
                    ?.replaceAll("_", " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (c) =>
                      c.toUpperCase()
                    )}
                </div>

              </div>

              {/* ACTION */}
              {order.status === "COMPLETED" && (
                <div className="mt-5 border-t border-slate-100 pt-4">

                  <button
                    onClick={() =>
                      viewResult(order.orderId)
                    }
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    <FileText size={17} />
                    View Test Result
                  </button>

                </div>
              )}

              {/* PROGRESS */}
              <div className="mt-5 border-t border-slate-100 pt-5">

                <div className="flex items-center justify-between text-xs text-slate-400">

                  <span
                    className={
                      order.status
                        ? "font-semibold text-blue-600"
                        : ""
                    }
                  >
                    Ordered
                  </span>

                  <span
                    className={
                      [
                        "SAMPLE_COLLECTED",
                        "PROCESSING",
                        "COMPLETED",
                      ].includes(order.status)
                        ? "font-semibold text-blue-600"
                        : ""
                    }
                  >
                    Sample
                  </span>

                  <span
                    className={
                      [
                        "PROCESSING",
                        "COMPLETED",
                      ].includes(order.status)
                        ? "font-semibold text-blue-600"
                        : ""
                    }
                  >
                    Processing
                  </span>

                  <span
                    className={
                      order.status === "COMPLETED"
                        ? "font-semibold text-green-600"
                        : ""
                    }
                  >
                    Completed
                  </span>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

      {/* ================================================= */}
      {/* RESULT MODAL */}
      {/* ================================================= */}

      {(selectedResult || resultLoading || resultError) && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FileText size={21} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Laboratory Test Result
                  </h2>

                  <p className="text-sm text-slate-500">
                    CBC / Complete Blood Count
                  </p>
                </div>

              </div>

              <button
                onClick={() => {
                  setSelectedResult(null);
                  setResultError("");
                }}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* BODY */}

            <div className="p-6">

              {resultLoading ? (

                <div className="flex flex-col items-center justify-center py-16">

                  <Loader2
                    size={35}
                    className="animate-spin text-blue-600"
                  />

                  <p className="mt-3 text-sm text-slate-500">
                    Loading test result...
                  </p>

                </div>

              ) : resultError ? (

                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {resultError}
                </div>

              ) : (

                <>

                  {/* Result */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                    <div className="mb-3 flex items-center gap-2">

                      <CheckCircle
                        size={19}
                        className="text-green-600"
                      />

                      <h3 className="font-bold text-slate-800">
                        Test Completed
                      </h3>

                    </div>

                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                      {selectedResult?.result ||
                        selectedResult?.testResult ||
                        "No result available."}
                    </p>

                  </div>

                  {/* Remarks */}

                  {selectedResult?.remarks && (

                    <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-5">

                      <h3 className="font-semibold text-blue-800">
                        Laboratory Remarks
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-blue-700">
                        {selectedResult.remarks}
                      </p>

                    </div>

                  )}

                  {/* Footer */}

                  <div className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-700">

                    <div className="flex items-center gap-2">

                      <CheckCircle size={17} />

                      <span>
                        This laboratory test has been completed.
                      </span>

                    </div>

                  </div>

                </>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}