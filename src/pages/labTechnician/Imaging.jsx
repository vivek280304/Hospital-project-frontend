import { useEffect, useState } from "react";
import {
  Image as ImageIcon,
  Search,
  RefreshCw,
  User,
  Calendar,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";

import labTechnicianService from "../../services/labTechnicianService";

export default function Imaging() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // =========================
  // LOAD PENDING IMAGING
  // =========================

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await labTechnicianService.getPendingImagingOrders();

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(
        "Failed to load imaging orders:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load imaging orders."
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // =========================
  // HELPERS
  // =========================

  const getOrderId = (order) =>
    order.id || order.orderId;

  const getPatientName = (order) =>
    order.patientName ||
    order.patient?.name ||
    order.patient?.user?.name ||
    "Unknown Patient";

  const getPatientId = (order) =>
    order.patientId ||
    order.patient?.id ||
    "—";

  const getImagingName = (order) =>
    order.imagingName ||
    order.testName ||
    order.imagingTestName ||
    order.test?.name ||
    order.test?.testName ||
    order.type ||
    "Imaging Test";

  const getDoctorName = (order) =>
    order.doctorName ||
    order.doctor?.name ||
    order.doctor?.user?.name ||
    "Not available";

  const getDate = (order) =>
    order.orderDate ||
    order.createdAt ||
    order.createdDate ||
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

  // =========================
  // SEARCH
  // =========================

  const filteredOrders = orders.filter((order) => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) return true;

    return (
      getPatientName(order)
        .toLowerCase()
        .includes(query) ||
      getImagingName(order)
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

  // =========================
  // FILE SELECT
  // =========================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    setError("");
    setSuccess("");

    // 50 MB limit
    if (file.size > 50 * 1024 * 1024) {
      setError(
        "File size must be less than 50 MB."
      );

      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  // =========================
  // OPEN UPLOAD
  // =========================

  const openUpload = (order) => {
    setSelectedOrder(order);
    setSelectedFile(null);
    setError("");
    setSuccess("");
  };

  // =========================
  // CLOSE UPLOAD
  // =========================

  const closeUpload = () => {
    if (uploading) return;

    setSelectedOrder(null);
    setSelectedFile(null);
  };

  // =========================
  // UPLOAD
  // =========================

  const handleUpload = async () => {
    if (!selectedOrder) return;

    if (!selectedFile) {
      setError("Please select an imaging file.");
      return;
    }

    const orderId = getOrderId(selectedOrder);

    try {
      setUploading(orderId);
      setError("");
      setSuccess("");

      const formData = new FormData();

      /*
       * Your existing service sends this FormData
       * to:
       *
       * POST /lab-technician/imaging-orders/{orderId}/upload
       *
       * The field name must match the @RequestParam
       * used by your backend controller.
       */
      formData.append("file", selectedFile);

      await labTechnicianService.uploadImaging(
        orderId,
        formData
      );

      setSuccess(
        "Imaging file uploaded successfully."
      );

      setSelectedOrder(null);
      setSelectedFile(null);

      await loadOrders();
    } catch (err) {
      console.error(
        "Imaging upload failed:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to upload imaging file."
      );
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
              <ImageIcon
                size={23}
                className="text-purple-600"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Imaging
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage pending imaging orders and upload reports
              </p>
            </div>

          </div>
        </div>

        <button
          onClick={loadOrders}
          disabled={loading}
          className="
            inline-flex items-center
            justify-center gap-2
            rounded-lg
            border border-gray-200
            bg-white px-4 py-2.5
            text-sm font-medium text-gray-700
            shadow-sm
            hover:bg-gray-50
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
          SEARCH
      ========================================= */}

      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

        <div className="relative">

          <Search
            size={18}
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
            placeholder="Search patient, imaging test, doctor or order ID..."
            className="
              w-full rounded-lg
              border border-gray-200
              bg-gray-50
              py-3 pl-10 pr-4
              text-sm outline-none
              focus:border-blue-500
              focus:bg-white
              focus:ring-2
              focus:ring-blue-100
            "
          />

        </div>

      </div>


      {/* =========================================
          ORDERS
      ========================================= */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-100 px-5 py-4">

          <h2 className="font-semibold text-gray-900">
            Pending Imaging Orders
          </h2>

          <p className="text-sm text-gray-500">
            {filteredOrders.length} pending order
            {filteredOrders.length !== 1
              ? "s"
              : ""}
          </p>

        </div>


        {/* LOADING */}

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
                Loading imaging orders...
              </p>

            </div>

          </div>

        ) : filteredOrders.length === 0 ? (

          /* EMPTY */

          <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">

              <ImageIcon
                size={28}
                className="text-gray-400"
              />

            </div>

            <h3 className="font-semibold text-gray-900">
              No pending imaging orders
            </h3>

            <p className="mt-1 max-w-md text-sm text-gray-500">
              There are currently no imaging orders
              waiting for upload.
            </p>

          </div>

        ) : (

          /* TABLE */

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

              <thead>

                <tr className="border-b border-gray-100 bg-gray-50 text-left">

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Patient
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Imaging
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

                {filteredOrders.map(
                  (order, index) => {
                    const id =
                      getOrderId(order);

                    return (
                      <tr
                        key={
                          id ||
                          `imaging-${index}`
                        }
                        className="
                          border-b
                          border-gray-100
                          last:border-0
                          hover:bg-gray-50
                        "
                      >

                        {/* PATIENT */}

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
                                Patient ID:{" "}
                                {getPatientId(
                                  order
                                )}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* IMAGING */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">

                              <ImageIcon
                                size={17}
                                className="text-purple-600"
                              />

                            </div>

                            <div>

                              <p className="text-sm font-medium text-gray-800">
                                {getImagingName(
                                  order
                                )}
                              </p>

                              <p className="text-xs text-gray-500">
                                Order #{id}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* DOCTOR */}

                        <td className="px-5 py-4">

                          <span className="text-sm text-gray-700">
                            {getDoctorName(
                              order
                            )}
                          </span>

                        </td>


                        {/* DATE */}

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


                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <span className="
                            inline-flex
                            items-center gap-2
                            rounded-full
                            bg-amber-50
                            px-3 py-1.5
                            text-xs font-medium
                            text-amber-700
                          ">

                            <span className="h-2 w-2 rounded-full bg-amber-500" />

                            Pending Upload

                          </span>

                        </td>


                        {/* ACTION */}

                        <td className="px-5 py-4 text-right">

                          <button
                            onClick={() =>
                              openUpload(order)
                            }
                            className="
                              inline-flex
                              items-center gap-2
                              rounded-lg
                              bg-blue-600
                              px-4 py-2
                              text-sm font-medium
                              text-white
                              hover:bg-blue-700
                            "
                          >
                            <Upload
                              size={16}
                            />

                            Upload

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


      {/* =========================================
          UPLOAD MODAL
      ========================================= */}

      {selectedOrder && (
        <div className="
          fixed inset-0 z-[100]
          flex items-center justify-center
          bg-black/50 p-4
        ">

          <div className="
            w-full max-w-lg
            rounded-2xl
            bg-white
            shadow-2xl
          ">

            {/* MODAL HEADER */}

            <div className="
              flex items-center
              justify-between
              border-b border-gray-100
              px-6 py-5
            ">

              <div>

                <h2 className="text-lg font-bold text-gray-900">
                  Upload Imaging
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {getPatientName(
                    selectedOrder
                  )}
                </p>

              </div>

              <button
                onClick={closeUpload}
                disabled={!!uploading}
                className="
                  rounded-lg p-2
                  text-gray-400
                  hover:bg-gray-100
                  hover:text-gray-700
                  disabled:opacity-50
                "
              >
                <X size={20} />
              </button>

            </div>


            {/* MODAL BODY */}

            <div className="space-y-5 p-6">

              {/* Order info */}

              <div className="rounded-xl bg-gray-50 p-4">

                <div className="grid gap-4 sm:grid-cols-2">

                  <div>
                    <p className="text-xs text-gray-400">
                      Patient
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {getPatientName(
                        selectedOrder
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Imaging
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {getImagingName(
                        selectedOrder
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Doctor
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {getDoctorName(
                        selectedOrder
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Order ID
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-800">
                      #{getOrderId(
                        selectedOrder
                      )}
                    </p>
                  </div>

                </div>

              </div>


              {/* File */}

              <div>

                <label className="
                  mb-2 block
                  text-sm font-medium
                  text-gray-700
                ">
                  Imaging File
                </label>

                <label className="
                  flex cursor-pointer
                  flex-col items-center
                  justify-center
                  rounded-xl
                  border-2 border-dashed
                  border-gray-300
                  bg-gray-50
                  px-6 py-8
                  text-center
                  transition
                  hover:border-blue-400
                  hover:bg-blue-50
                ">

                  <Upload
                    size={28}
                    className="mb-3 text-blue-500"
                  />

                  <span className="text-sm font-medium text-gray-700">
                    Click to select file
                  </span>

                  <span className="mt-1 text-xs text-gray-400">
                    Maximum file size: 50 MB
                  </span>

                  <input
                    type="file"
                    accept="
                      image/*
                      ,.pdf
                      ,.dcm
                    "
                    onChange={
                      handleFileChange
                    }
                    className="hidden"
                  />

                </label>

              </div>


              {/* Selected file */}

              {selectedFile && (
                <div className="
                  flex items-center
                  gap-3 rounded-xl
                  border border-blue-100
                  bg-blue-50 p-4
                ">

                  <div className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-lg
                    bg-white
                  ">
                    <FileText
                      size={19}
                      className="text-blue-600"
                    />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="
                      truncate
                      text-sm font-medium
                      text-gray-800
                    ">
                      {selectedFile.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {(
                        selectedFile.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      setSelectedFile(null)
                    }
                    disabled={!!uploading}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={18} />
                  </button>

                </div>
              )}

            </div>


            {/* MODAL FOOTER */}

            <div className="
              flex justify-end gap-3
              border-t border-gray-100
              px-6 py-4
            ">

              <button
                onClick={closeUpload}
                disabled={!!uploading}
                className="
                  rounded-lg
                  border border-gray-200
                  bg-white px-4 py-2.5
                  text-sm font-medium
                  text-gray-700
                  hover:bg-gray-50
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                onClick={handleUpload}
                disabled={
                  !selectedFile ||
                  !!uploading
                }
                className="
                  inline-flex
                  items-center gap-2
                  rounded-lg
                  bg-blue-600
                  px-5 py-2.5
                  text-sm font-medium
                  text-white
                  hover:bg-blue-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                {uploading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={17} />

                    Upload
                  </>
                )}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}