import { useEffect, useState } from "react";
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
  AlertCircle,
  Loader2,
} from "lucide-react";

import labTechnicianService from "../../services/labTechnicianService";

const STATUS_CONFIG = {
  ORDERED: {
    label: "Ordered",
    icon: TestTube,
  },
  CLAIMED: {
    label: "Claimed",
    icon: PackageCheck,
  },
  SAMPLE_COLLECTED: {
    label: "Sample Collected",
    icon: CheckCircle2,
  },
  PROCESSING: {
    label: "Processing",
    icon: PlayCircle,
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
  },
};

export default function LabOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ORDERED");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await labTechnicianService.getLabOrders(
        selectedStatus
      );

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load lab orders:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load laboratory orders."
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [selectedStatus]);

  const handleAction = async (order, action) => {
    const orderId = order.id || order.orderId;

    if (!orderId) {
      setError("Order ID is missing.");
      return;
    }

    try {
      setActionLoading(orderId);
      setError("");
      setSuccess("");

      if (action === "claim") {
        await labTechnicianService.claimOrder(orderId);
        setSuccess("Order claimed successfully.");
      }

      if (action === "collect") {
        await labTechnicianService.collectSample(orderId);
        setSuccess("Sample collected successfully.");
      }

      if (action === "processing") {
        await labTechnicianService.startProcessing(orderId);
        setSuccess("Sample processing started.");
      }

      await loadOrders();
    } catch (err) {
      console.error("Lab order action failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to perform this action."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const getPatientName = (order) => {
    return (
      order.patientName ||
      order.patient?.name ||
      order.patient?.user?.name ||
      "Unknown Patient"
    );
  };

  const getTestName = (order) => {
    return (
      order.testName ||
      order.labTestName ||
      order.test?.name ||
      order.test?.testName ||
      "Laboratory Test"
    );
  };

  const getDoctorName = (order) => {
    return (
      order.doctorName ||
      order.doctor?.name ||
      order.doctor?.user?.name ||
      "Not available"
    );
  };

  const getStatus = (order) => {
    return (
      order.status ||
      order.orderStatus ||
      "ORDERED"
    );
  };

  const getDate = (order) => {
    return (
      order.orderDate ||
      order.createdAt ||
      order.createdDate ||
      null
    );
  };

  const formatDate = (value) => {
    if (!value) return "—";

    try {
      return new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return value;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

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
      String(order.id || order.orderId || "")
        .toLowerCase()
        .includes(query)
    );
  });

  const renderAction = (order) => {
    const status = getStatus(order);
    const orderId = order.id || order.orderId;

    if (status === "ORDERED") {
      return (
        <button
          onClick={() => handleAction(order, "claim")}
          disabled={actionLoading === orderId}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {actionLoading === orderId ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <PackageCheck size={16} />
          )}
          Claim
        </button>
      );
    }

    if (status === "CLAIMED") {
      return (
        <button
          onClick={() => handleAction(order, "collect")}
          disabled={actionLoading === orderId}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {actionLoading === orderId ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <TestTube size={16} />
          )}
          Collect Sample
        </button>
      );
    }

    if (status === "SAMPLE_COLLECTED") {
      return (
        <button
          onClick={() => handleAction(order, "processing")}
          disabled={actionLoading === orderId}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {actionLoading === orderId ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <PlayCircle size={16} />
          )}
          Start Processing
        </button>
      );
    }

    if (status === "PROCESSING") {
      return (
        <span className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
          <Loader2 size={16} />
          Processing
        </span>
      );
    }

    if (status === "COMPLETED") {
      return (
        <span className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
          <CheckCircle2 size={16} />
          Completed
        </span>
      );
    }

    return (
      <span className="text-sm text-gray-500">
        No action
      </span>
    );
  };

  const statusInfo = STATUS_CONFIG[selectedStatus];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
              <TestTube className="text-blue-600" size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Lab Orders
              </h1>

              <p className="text-sm text-gray-500">
                Manage laboratory test orders and sample processing
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadOrders}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={19} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2 size={19} />
          <span>{success}</span>
        </div>
      )}

      {/* Status tabs */}
      <div className="mb-5 overflow-x-auto rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
        <div className="flex min-w-max gap-2">
          {Object.entries(STATUS_CONFIG).map(
            ([status, config]) => {
              const Icon = config.icon;
              const active = selectedStatus === status;

              return (
                <button
                  key={status}
                  onClick={() => {
                    setSelectedStatus(status);
                    setSuccess("");
                    setError("");
                  }}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={17} />
                  {config.label}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search patient, test, doctor or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Orders */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Table header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="font-semibold text-gray-900">
              {statusInfo?.label} Orders
            </h2>

            <p className="text-sm text-gray-500">
              {filteredOrders.length} order
              {filteredOrders.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <Loader2
                size={32}
                className="mx-auto mb-3 animate-spin text-blue-600"
              />

              <p className="text-sm text-gray-500">
                Loading laboratory orders...
              </p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <TestTube
                size={28}
                className="text-gray-400"
              />
            </div>

            <h3 className="font-semibold text-gray-900">
              No orders found
            </h3>

            <p className="mt-1 max-w-md text-sm text-gray-500">
              There are no {selectedStatus.toLowerCase()} laboratory
              orders matching your search.
            </p>
          </div>
        ) : (
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
                    Order Date
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order, index) => {
                  const status = getStatus(order);
                  const config =
                    STATUS_CONFIG[status] ||
                    STATUS_CONFIG.ORDERED;

                  const StatusIcon = config.icon;

                  return (
                    <tr
                      key={
                        order.id ||
                        order.orderId ||
                        `order-${index}`
                      }
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
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
                              {getPatientName(order)}
                            </p>

                            <p className="text-xs text-gray-500">
                              Order #
                              {order.id ||
                                order.orderId ||
                                "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Test */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <TestTube
                            size={17}
                            className="text-purple-500"
                          />

                          <span className="text-sm font-medium text-gray-800">
                            {getTestName(order)}
                          </span>
                        </div>
                      </td>

                      {/* Doctor */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700">
                          {getDoctorName(order)}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} />
                          {formatDate(getDate(order))}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                            status === "ORDERED"
                              ? "bg-blue-50 text-blue-700"
                              : status === "CLAIMED"
                              ? "bg-indigo-50 text-indigo-700"
                              : status ===
                                "SAMPLE_COLLECTED"
                              ? "bg-purple-50 text-purple-700"
                              : status === "PROCESSING"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          <StatusIcon size={14} />
                          {config.label}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        {renderAction(order)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}