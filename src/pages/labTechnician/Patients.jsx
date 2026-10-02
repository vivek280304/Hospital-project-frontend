import { useEffect, useMemo, useState } from "react";
import {
  Search,
  User,
  Mail,
  Phone,
  CalendarDays,
  FlaskConical,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import labTechnicianService from "../../services/labTechnicianService";

export default function Patients() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const statuses = [
        "ORDERED",
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

      const allOrders = responses.flat();

      // Remove duplicate orders
      const uniqueOrders = Array.from(
        new Map(
          allOrders.map((order) => [order.id, order])
        ).values()
      );

      setOrders(uniqueOrders);
    } catch (err) {
      console.error("Failed to load patients:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load patient information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  /*
   * Patient information is derived from LabOrderResponse.
   *
   * Because the exact LabOrderResponse DTO was not provided,
   * these fallbacks support common field names without
   * changing the backend.
   */
  const patients = useMemo(() => {
    const patientMap = new Map();

    orders.forEach((order) => {
      const patient =
        order.patient ||
        order.patientDetails ||
        {};

      const patientId =
        patient.id ||
        order.patientId ||
        order.patient?.id;

      const name =
        patient.name ||
        patient.patientName ||
        order.patientName ||
        "Unknown Patient";

      const email =
        patient.email ||
        patient.patientEmail ||
        order.patientEmail ||
        "";

      const phone =
        patient.phone ||
        patient.phoneNumber ||
        patient.mobile ||
        order.patientPhone ||
        "";

      const key = patientId || `${name}-${email}`;

      if (!patientMap.has(key)) {
        patientMap.set(key, {
          id: patientId || "N/A",
          name,
          email,
          phone,
          orders: [],
        });
      }

      patientMap.get(key).orders.push(order);
    });

    return Array.from(patientMap.values());
  }, [orders]);

  const filteredPatients = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return patients;
    }

    return patients.filter((patient) => {
      return (
        patient.name.toLowerCase().includes(value) ||
        String(patient.id).toLowerCase().includes(value) ||
        patient.email.toLowerCase().includes(value) ||
        patient.phone.toLowerCase().includes(value)
      );
    });
  }, [patients, search]);

  const getLatestOrder = (patient) => {
    if (!patient.orders.length) {
      return null;
    }

    return patient.orders[patient.orders.length - 1];
  };

  const getStatusClass = (status) => {
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
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-full bg-gray-50 p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Patients
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View patients associated with laboratory orders
          </p>
        </div>

        <button
          onClick={loadPatients}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative">

          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient by name, ID, email or phone..."
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-gray-200 bg-white">
          <div className="text-center">

            <RefreshCw
              size={30}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-3 text-sm text-gray-500">
              Loading patients...
            </p>

          </div>
        </div>
      ) : filteredPatients.length === 0 ? (

        /* Empty */
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">

          <User
            size={45}
            className="mx-auto text-gray-300"
          />

          <h2 className="mt-4 text-lg font-semibold text-gray-700">
            No patients found
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {search
              ? "Try a different search."
              : "No patients are currently associated with laboratory orders."}
          </p>

        </div>

      ) : (

        /* Patient Cards */
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

          {filteredPatients.map((patient) => {
            const latestOrder = getLatestOrder(patient);

            return (
              <div
                key={patient.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >

                {/* Patient Header */}
                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <User size={23} />
                    </div>

                    <div>
                      <h2 className="font-semibold text-gray-800">
                        {patient.name}
                      </h2>

                      <p className="text-xs text-gray-500">
                        Patient ID: {patient.id}
                      </p>
                    </div>

                  </div>

                  {latestOrder && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                        latestOrder.status
                      )}`}
                    >
                      {latestOrder.status?.replaceAll(
                        "_",
                        " "
                      )}
                    </span>
                  )}

                </div>

                {/* Contact */}
                <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">

                  {patient.email && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Mail
                        size={17}
                        className="text-gray-400"
                      />

                      <span>{patient.email}</span>
                    </div>
                  )}

                  {patient.phone && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Phone
                        size={17}
                        className="text-gray-400"
                      />

                      <span>{patient.phone}</span>
                    </div>
                  )}

                </div>

                {/* Lab Information */}
                <div className="mt-5 grid grid-cols-2 gap-3">

                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center gap-2 text-gray-500">
                      <FlaskConical size={16} />
                      <span className="text-xs">
                        Lab Orders
                      </span>
                    </div>

                    <p className="mt-1 text-lg font-semibold text-gray-800">
                      {patient.orders.length}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center gap-2 text-gray-500">
                      <CalendarDays size={16} />
                      <span className="text-xs">
                        Latest Test
                      </span>
                    </div>

                    <p className="mt-1 truncate text-sm font-semibold text-gray-800">
                      {latestOrder?.testName ||
                        latestOrder?.labTestName ||
                        latestOrder?.test ||
                        "—"}
                    </p>
                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

      {/* Count */}
      {!loading && filteredPatients.length > 0 && (
        <div className="mt-5 text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-700">
            {filteredPatients.length}
          </span>{" "}
          patient{filteredPatients.length !== 1 ? "s" : ""}
        </div>
      )}

    </div>
  );
}