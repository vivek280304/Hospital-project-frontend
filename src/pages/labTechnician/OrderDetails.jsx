import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  TestTube,
  Calendar,
  FileText,
  CheckCircle2,
  PackageCheck,
  PlayCircle,
  Loader2,
  AlertCircle,
  Save,
} from "lucide-react";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import labTechnicianService from "../../services/labTechnicianService";

const STATUS_CONFIG = {
  ORDERED: {
    label: "Ordered",
    icon: TestTube,
    className: "bg-blue-50 text-blue-700",
  },

  CLAIMED: {
    label: "Claimed",
    icon: PackageCheck,
    className: "bg-indigo-50 text-indigo-700",
  },

  SAMPLE_COLLECTED: {
    label: "Sample Collected",
    icon: CheckCircle2,
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

export default function OrderDetails() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(
    location.state?.order || null
  );

  const [result, setResult] = useState("");
  const [remarks, setRemarks] = useState("");

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================
  // ORDER HELPERS
  // =========================================

  const getOrderId = () =>
    order?.id || order?.orderId || orderId;

  const getPatientName = () =>
    order?.patientName ||
    order?.patient?.name ||
    order?.patient?.user?.name ||
    "Unknown Patient";

  const getPatientId = () =>
    order?.patientId ||
    order?.patient?.id ||
    "Not available";

  const getPatientAge = () =>
    order?.patientAge ||
    order?.patient?.age ||
    "Not available";

  const getPatientGender = () =>
    order?.patientGender ||
    order?.patient?.gender ||
    "Not available";

  const getTestName = () =>
    order?.testName ||
    order?.labTestName ||
    order?.test?.name ||
    order?.test?.testName ||
    "Laboratory Test";

  const getDoctorName = () =>
    order?.doctorName ||
    order?.doctor?.name ||
    order?.doctor?.user?.name ||
    "Not available";

  const getStatus = () =>
    order?.status ||
    order?.orderStatus ||
    "ORDERED";

  const getOrderDate = () =>
    order?.orderDate ||
    order?.createdAt ||
    order?.createdDate ||
    null;

  const getExistingResult = () =>
    order?.result ||
    order?.resultValue ||
    order?.testResult ||
    "";

  const getExistingRemarks = () =>
    order?.remarks ||
    order?.resultRemarks ||
    "";

  // =========================================
  // INITIAL RESULT DATA
  // =========================================

  useEffect(() => {
    if (order) {
      setResult(getExistingResult());
      setRemarks(getExistingRemarks());
    }
  }, [order]);

  // =========================================
  // DATE
  // =========================================

  const formatDate = (value) => {
    if (!value) return "Not available";

    try {
      return new Date(value).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      );
    } catch {
      return value;
    }
  };

  // =========================================
  // COMPLETE TEST
  // =========================================

  const handleCompleteTest = async () => {
    setError("");
    setSuccess("");

    if (!result.trim()) {
      setError("Test result is required.");
      return;
    }

    try {
      setActionLoading(true);

      const data = {
        result: result.trim(),
        remarks: remarks.trim(),
      };

      await labTechnicianService.completeOrder(
        getOrderId(),
        data
      );

      setSuccess(
        "Laboratory test completed successfully."
      );

      // Update local order status
      setOrder((previous) => ({
        ...previous,
        status: "COMPLETED",
        result: result.trim(),
        remarks: remarks.trim(),
      }));
    } catch (err) {
      console.error(
        "Failed to complete lab test:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to complete laboratory test."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================
  // NO ORDER
  // =========================================

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">

        <button
          onClick={() =>
            navigate("/lab-technician/my-work")
          }
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to My Work
        </button>

        <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-gray-200 bg-white">

          <div className="text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertCircle
                size={30}
                className="text-red-500"
              />
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              Order details unavailable
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Order #{orderId} could not be loaded.
            </p>

            <button
              onClick={() =>
                navigate("/lab-technician/my-work")
              }
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Back to My Work
            </button>

          </div>

        </div>
      </div>
    );
  }

  const status = getStatus();

  const statusConfig =
    STATUS_CONFIG[status] ||
    STATUS_CONFIG.ORDERED;

  const StatusIcon = statusConfig.icon;

  const isProcessing = status === "PROCESSING";
  const isCompleted = status === "COMPLETED";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="mb-6">

        <button
          onClick={() =>
            navigate("/lab-technician/my-work")
          }
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to My Work
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Laboratory Order
            </p>

            <h1 className="text-2xl font-bold text-gray-900">
              Order #{getOrderId()}
            </h1>

          </div>

          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${statusConfig.className}`}
          >
            <StatusIcon size={17} />
            {statusConfig.label}
          </span>

        </div>

      </div>


      {/* =========================================
          MESSAGES
      ========================================= */}

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


      {/* =========================================
          PATIENT + STATUS
      ========================================= */}

      <div className="mb-5 grid gap-5 lg:grid-cols-3">

        {/* Patient */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">

              <User
                size={22}
                className="text-blue-600"
              />

            </div>

            <div>

              <h2 className="font-semibold text-gray-900">
                Patient Information
              </h2>

              <p className="text-sm text-gray-500">
                Patient details
              </p>

            </div>

          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <InfoItem
              label="Patient Name"
              value={getPatientName()}
            />

            <InfoItem
              label="Patient ID"
              value={getPatientId()}
            />

            <InfoItem
              label="Age"
              value={getPatientAge()}
            />

            <InfoItem
              label="Gender"
              value={getPatientGender()}
            />

          </div>

        </div>


        {/* Status */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <h2 className="mb-5 font-semibold text-gray-900">
            Order Status
          </h2>

          <div className="flex items-center gap-3">

            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${statusConfig.className}`}
            >
              <StatusIcon size={22} />
            </div>

            <div>

              <p className="font-medium text-gray-900">
                {statusConfig.label}
              </p>

              <p className="text-xs text-gray-500">
                Current order status
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =========================================
          TEST INFORMATION
      ========================================= */}

      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">

            <TestTube
              size={22}
              className="text-purple-600"
            />

          </div>

          <div>

            <h2 className="font-semibold text-gray-900">
              Laboratory Test
            </h2>

            <p className="text-sm text-gray-500">
              Test order information
            </p>

          </div>

        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <InfoItem
            label="Test Name"
            value={getTestName()}
          />

          <InfoItem
            label="Doctor"
            value={getDoctorName()}
          />

          <InfoItem
            label="Order Date"
            value={formatDate(
              getOrderDate()
            )}
          />

        </div>

      </div>


      {/* =========================================
          CLINICAL INFORMATION
      ========================================= */}

      {(order.reason ||
        order.notes ||
        order.description) && (
        <div className="mb-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="mb-4 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">

              <FileText
                size={20}
                className="text-amber-600"
              />

            </div>

            <div>

              <h2 className="font-semibold text-gray-900">
                Clinical Information
              </h2>

              <p className="text-sm text-gray-500">
                Information provided with the order
              </p>

            </div>

          </div>

          <div className="rounded-lg bg-gray-50 p-4">

            <p className="text-sm leading-6 text-gray-700">
              {order.reason ||
                order.notes ||
                order.description}
            </p>

          </div>

        </div>
      )}


      {/* =========================================
          ENTER RESULT
      ========================================= */}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-100 px-5 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">

              <FileText
                size={22}
                className="text-green-600"
              />

            </div>

            <div>

              <h2 className="font-semibold text-gray-900">
                Laboratory Result
              </h2>

              <p className="text-sm text-gray-500">
                Enter the final test result
              </p>

            </div>

          </div>

        </div>


        <div className="space-y-5 p-5">

          {/* Result */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Result
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <textarea
              value={result}
              onChange={(e) =>
                setResult(e.target.value)
              }
              disabled={isCompleted}
              rows={6}
              placeholder="Enter the laboratory test result..."
              className="
                w-full resize-y
                rounded-xl
                border border-gray-200
                bg-gray-50
                px-4 py-3
                text-sm text-gray-800
                outline-none
                transition
                focus:border-blue-500
                focus:bg-white
                focus:ring-2
                focus:ring-blue-100
                disabled:cursor-not-allowed
                disabled:bg-gray-100
              "
            />

            <p className="mt-1.5 text-xs text-gray-400">
              Enter the complete laboratory finding/result.
            </p>

          </div>


          {/* Remarks */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Remarks
              <span className="ml-1 text-xs font-normal text-gray-400">
                (Optional)
              </span>
            </label>

            <textarea
              value={remarks}
              onChange={(e) =>
                setRemarks(e.target.value)
              }
              disabled={isCompleted}
              rows={4}
              placeholder="Add any additional remarks..."
              className="
                w-full resize-y
                rounded-xl
                border border-gray-200
                bg-gray-50
                px-4 py-3
                text-sm text-gray-800
                outline-none
                transition
                focus:border-blue-500
                focus:bg-white
                focus:ring-2
                focus:ring-blue-100
                disabled:cursor-not-allowed
                disabled:bg-gray-100
              "
            />

          </div>


          {/* Complete */}

          {!isCompleted && (
            <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-sm font-medium text-gray-700">
                  Ready to complete?
                </p>

                <p className="text-xs text-gray-500">
                  Once completed, the result will be saved.
                </p>

              </div>

              <button
                onClick={handleCompleteTest}
                disabled={
                  actionLoading ||
                  !result.trim() ||
                  !isProcessing
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-green-600
                  px-5 py-3
                  text-sm font-semibold
                  text-white
                  hover:bg-green-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                {actionLoading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Completing...
                  </>
                ) : (
                  <>
                    <CheckCircle2
                      size={18}
                    />

                    Complete Test
                  </>
                )}

              </button>

            </div>
          )}


          {/* Completed message */}

          {isCompleted && (
            <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">

              <CheckCircle2
                size={22}
                className="text-green-600"
              />

              <div>

                <p className="text-sm font-semibold text-green-800">
                  Test Completed
                </p>

                <p className="text-xs text-green-700">
                  This laboratory result has already been completed.
                </p>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}


// =========================================
// INFO ITEM
// =========================================

function InfoItem({ label, value }) {
  return (
    <div>

      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="text-sm font-medium text-gray-800">
        {value || "Not available"}
      </p>

    </div>
  );
}