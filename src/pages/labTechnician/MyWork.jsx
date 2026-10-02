import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  TestTube,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  PlayCircle,
  PackageCheck,
  Loader2,
  AlertCircle,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import labTechnicianService from "../../services/labTechnicianService";

const STATUS_CONFIG = {
  CLAIMED: {
    label: "Claimed",
    icon: PackageCheck,
    className: "bg-blue-50 text-blue-700",
  },
  SAMPLE_COLLECTED: {
    label: "Sample Collected",
    icon: TestTube,
    className: "bg-purple-50 text-purple-700",
  },
  PROCESSING: {
    label: "Processing",
    icon: PlayCircle,
    className: "bg-amber-50 text-amber-700",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-green-50 text-green-700",
  },
};

export default function MyWork() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const loadMyWork = async () => {
    try {
      setLoading(true);
      setError("");

      const statuses = [
        "CLAIMED",
        "SAMPLE_COLLECTED",
        "PROCESSING",
        "COMPLETED",
      ];

      const responses = await Promise.all(
        statuses.map((status) =>
          labTechnicianService.getLabOrders(status)
        )
      );

      const allOrders = responses.flatMap((response) =>
        Array.isArray(response) ? response : []
      );

      // Remove duplicate orders
      const uniqueOrders = Array.from(
        new Map(
          allOrders.map((order) => [
            order.id || order.orderId,
            order,
          ])
        ).values()
      );

      setOrders(uniqueOrders);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load your work."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyWork();
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

  const getStatus = (order) =>
    order.status ||
    order.orderStatus ||
    "ORDERED";

  const getDate = (order) =>
    order.orderDate ||
    order.createdAt ||
    order.createdDate;

  const formatDate = (date) => {
    if (!date) return "—";

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return date;
    }
  };

  const filteredOrders = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) return orders;

    return orders.filter((order) => {
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
  }, [orders, search]);

  const handleCollect = async (order) => {
    const id = getOrderId(order);

    try {
      setActionLoading(id);
      setError("");

      await labTechnicianService.collectSample(id);

      await loadMyWork();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to collect sample."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleProcessing = async (order) => {
    const id = getOrderId(order);

    try {
      setActionLoading(id);
      setError("");

      await labTechnicianService.startProcessing(id);

      await loadMyWork();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to start processing."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const renderAction = (order) => {
    const status = getStatus(order);
    const id = getOrderId(order);

    if (status === "CLAIMED") {
      return (
        <button
          onClick={() => handleCollect(order)}
          disabled={actionLoading === id}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-60"
        >
          {actionLoading === id ? (
            <Loader2
              size={16}
              className="animate-spin"
            />
          ) : (
            <TestTube size={16} />
          )}
          Collect
        </button>
      );
    }

    if (status === "SAMPLE_COLLECTED") {
      return (
        <button
          onClick={() => handleProcessing(order)}
          disabled={actionLoading === id}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-60"
        >
          {actionLoading === id ? (
            <Loader2
              size={16}
              className="animate-spin"
            />
          ) : (
            <PlayCircle size={16} />
          )}
          Process
        </button>
      );
    }

    if (status === "PROCESSING") {
      return (
        <span className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
          Processing
        </span>
      );
    }

    return (
      <span className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
        Completed
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Work
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Laboratory orders assigned to you
          </p>
        </div>

        <button
          onClick={loadMyWork}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
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

      {/* Error */}
      {error && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={19} />
          {error}
        </div>
      )}

      {/* Search */}
      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search patient, test, doctor or order ID..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Content */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Assigned Orders
          </h2>

          <p className="text-sm text-gray-500">
            {filteredOrders.length} order
            {filteredOrders.length !== 1
              ? "s"
              : ""}
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <Loader2
                size={32}
                className="mx-auto mb-3 animate-spin text-blue-600"
              />

              <p className="text-sm text-gray-500">
                Loading your work...
              </p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <FlaskConical
                size={28}
                className="text-gray-400"
              />
            </div>

            <h3 className="font-semibold text-gray-900">
              No assigned work
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              You currently have no laboratory orders.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">

              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">

                  <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                    Patient
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                    Test
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                    Doctor
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>
                {filteredOrders.map(
                  (order, index) => {
                    const id =
                      getOrderId(order);

                    const status =
                      getStatus(order);

                    const config =
                      STATUS_CONFIG[
                        status
                      ] ||
                      STATUS_CONFIG.CLAIMED;

                    const StatusIcon =
                      config.icon;

                    return (
                      <tr
                        key={
                          id ||
                          `order-${index}`
                        }
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
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

                            <span className="text-sm font-medium">
                              {getTestName(
                                order
                              )}
                            </span>
                          </div>
                        </td>

                        {/* Doctor */}
                        <td className="px-5 py-4 text-sm text-gray-700">
                          {getDoctorName(
                            order
                          )}
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

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${config.className}`}
                          >
                            <StatusIcon
                              size={14}
                            />
                            {config.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">

                            <button
                              onClick={() =>
                                navigate(`/lab-technician/orders/${id}`, {
      state: {
        order,
      },
    })
  }
                              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              <Eye size={16} />
                              View
                            </button>

                            {renderAction(
                              order
                            )}

                          </div>
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