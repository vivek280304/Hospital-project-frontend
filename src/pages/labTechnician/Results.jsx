import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  TestTube,
  User,
  Calendar,
  Eye,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import labTechnicianService from "../../services/labTechnicianService";

export default function TestResults() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadResults = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await labTechnicianService.getLabOrders(
          "COMPLETED"
        );

      setResults(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Failed to load test results:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load test results."
      );

      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  const getOrderId = (order) =>
    order.id || order.orderId;

  const getPatientName = (order) =>
    order.patientName ||
    order.patient?.name ||
    order.patient?.user?.name ||
    "Unknown Patient";

  const getTestName = (order) =>
    order.testName ||
    order.labTestName ||
    order.test?.name ||
    order.test?.testName ||
    "Laboratory Test";

  const getDoctorName = (order) =>
    order.doctorName ||
    order.doctor?.name ||
    order.doctor?.user?.name ||
    "Not available";

  const getDate = (order) =>
    order.completedAt ||
    order.resultDate ||
    order.updatedAt ||
    order.orderDate ||
    order.createdAt;

  const getResult = (order) =>
    order.result ||
    order.resultValue ||
    order.testResult ||
    order.report ||
    order.reportText ||
    null;

  const formatDate = (value) => {
    if (!value) return "—";

    try {
      return new Date(value).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return value;
    }
  };

  const filteredResults = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return results;
    }

    return results.filter((order) => {
      return (
        getPatientName(order)
          .toLowerCase()
          .includes(query) ||
        getTestName(order)
          .toLowerCase()
          .includes(query) ||
        getDoctorName(order)
          .toLowerCase()
          .includes(query) ||
        String(getOrderId(order))
          .toLowerCase()
          .includes(query)
      );
    });
  }, [results, search]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
              <FileText
                size={23}
                className="text-green-600"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Test Results
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                View completed laboratory test orders
              </p>
            </div>

          </div>
        </div>

        <button
          onClick={loadResults}
          disabled={loading}
          className="
            inline-flex items-center
            justify-center gap-2
            rounded-lg border border-gray-200
            bg-white px-4 py-2.5
            text-sm font-medium text-gray-700
            shadow-sm hover:bg-gray-50
            disabled:opacity-60
          "
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>


      {/* =========================================
          ERROR
      ========================================= */}

      {error && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

          <AlertCircle size={19} />

          <span>{error}</span>

        </div>
      )}


      {/* =========================================
          SEARCH
      ========================================= */}

      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

        <div className="relative">

          <Search
            size={19}
            className="
              absolute left-3 top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search patient, test, doctor or order ID..."
            className="
              w-full rounded-lg
              border border-gray-200
              bg-gray-50
              py-3 pl-10 pr-4
              text-sm outline-none
              transition
              focus:border-blue-500
              focus:bg-white
              focus:ring-2
              focus:ring-blue-100
            "
          />

        </div>

      </div>


      {/* =========================================
          RESULTS TABLE
      ========================================= */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* Table Header */}

        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

          <div>
            <h2 className="font-semibold text-gray-900">
              Completed Results
            </h2>

            <p className="text-sm text-gray-500">
              {filteredResults.length} result
              {filteredResults.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

        </div>


        {/* Loading */}

        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center">

            <div className="text-center">

              <Loader2
                size={32}
                className="
                  mx-auto mb-3
                  animate-spin
                  text-blue-600
                "
              />

              <p className="text-sm text-gray-500">
                Loading test results...
              </p>

            </div>

          </div>
        ) : filteredResults.length === 0 ? (

          /* Empty */

          <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">

              <FileText
                size={28}
                className="text-gray-400"
              />

            </div>

            <h3 className="font-semibold text-gray-900">
              No test results
            </h3>

            <p className="mt-1 max-w-md text-sm text-gray-500">
              There are currently no completed
              laboratory test results.
            </p>

          </div>

        ) : (

          /* Results */

          <div className="overflow-x-auto">

            <table className="w-full min-w-[950px]">

              <thead>

                <tr className="border-b border-gray-100 bg-gray-50 text-left">

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Patient
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Test
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Doctor
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Result
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Completed
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredResults.map(
                  (order, index) => {
                    const id =
                      getOrderId(order);

                    const result =
                      getResult(order);

                    return (
                      <tr
                        key={
                          id ||
                          `result-${index}`
                        }
                        className="
                          border-b
                          border-gray-100
                          last:border-0
                          hover:bg-gray-50
                        "
                      >

                        {/* Patient */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">

                              <User
                                size={18}
                                className="text-blue-600"
                              />

                            </div>

                            <div>

                              <p className="font-medium text-gray-900">
                                {getPatientName(
                                  order
                                )}
                              </p>

                              <p className="text-xs text-gray-500">
                                Order #{id}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* Test */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <TestTube
                              size={17}
                              className="text-purple-600"
                            />

                            <span className="text-sm font-medium text-gray-800">
                              {getTestName(
                                order
                              )}
                            </span>

                          </div>

                        </td>


                        {/* Doctor */}

                        <td className="px-5 py-4">

                          <span className="text-sm text-gray-700">
                            {getDoctorName(
                              order
                            )}
                          </span>

                        </td>


                        {/* Result */}

                        <td className="px-5 py-4">

                          <div className="max-w-[220px]">

                            <p className="truncate text-sm font-medium text-gray-800">
                              {result ||
                                "Result available"}
                            </p>

                          </div>

                        </td>


                        {/* Date */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2 text-sm text-gray-600">

                            <Calendar
                              size={16}
                            />

                            {formatDate(
                              getDate(order)
                            )}

                          </div>

                        </td>


                        {/* Action */}

                        <td className="px-5 py-4 text-right">

                          <button
                            onClick={() =>
                              navigate(
                                `/lab-technician/orders/${id}`,
                                {
                                  state: {
                                    order,
                                  },
                                }
                              )
                            }
                            className="
                              inline-flex
                              items-center gap-2
                              rounded-lg
                              border border-gray-200
                              bg-white px-3 py-2
                              text-sm font-medium
                              text-gray-700
                              hover:bg-gray-50
                            "
                          >
                            <Eye size={16} />

                            View
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}