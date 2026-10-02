import { useEffect, useState } from "react";
import {
  FlaskConical,
  Loader2,
  CalendarDays,
  Clock,
  X,
  CheckCircle,
  AlertCircle,
  CircleCheck,
} from "lucide-react";

import patientService from "../../services/patientService";

export default function LabTests() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTest, setSelectedTest] = useState(null);

  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  // Confirmation animation
  const [confirmed, setConfirmed] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await patientService.getAvailableLabTests();

      setData(
        Array.isArray(response)
          ? response
          : response?.data || []
      );
    } catch (err) {
      console.error("Failed to load lab tests:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load laboratory tests."
      );
    } finally {
      setLoading(false);
    }
  };

  const openBooking = (test) => {
    setSelectedTest(test);
    setScheduledDate("");
    setScheduledTime("");
    setError("");
  };

  const closeBooking = () => {
    if (!booking) {
      setSelectedTest(null);
      setError("");
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();

    setError("");

    if (!scheduledDate) {
      setError("Please select a date.");
      return;
    }

    if (!scheduledTime) {
      setError("Please select a time.");
      return;
    }

    try {
      setBooking(true);

      const response =
        await patientService.bookLabTest({
          labTestId: selectedTest.id,
          scheduledDate,
          scheduledTime,
        });

      /*
       * Save backend response.
       * This may contain orderId depending on your backend response.
       */
      setBookingResponse(response);

      // Show confirmation animation
      setConfirmed(true);

    } catch (err) {
      console.error("Lab test booking failed:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to book laboratory test."
      );
    } finally {
      setBooking(false);
    }
  };

  const finishConfirmation = () => {
    setConfirmed(false);
    setSelectedTest(null);
    setBookingResponse(null);
    setScheduledDate("");
    setScheduledTime("");
    setError("");
  };

  const today = new Date()
    .toISOString()
    .split("T")[0];

  return (
    <div className="mx-auto max-w-7xl">

      {/* ================= HEADER ================= */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Lab Tests
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Browse and book available laboratory tests
        </p>
      </div>

      {/* ================= ERROR ================= */}

      {error && !selectedTest && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* ================= LOADING ================= */}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2
            size={32}
            className="animate-spin text-blue-600"
          />
        </div>
      ) : data.length === 0 ? (

        <div className="rounded-2xl border border-slate-200 bg-white py-14 text-center">
          <FlaskConical
            size={42}
            className="mx-auto text-slate-300"
          />

          <p className="mt-4 text-sm text-slate-400">
            No active lab tests.
          </p>
        </div>

      ) : (

        /* ================= TEST CARDS ================= */

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {data.map((test) => (

            <div
              key={test.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <FlaskConical size={22} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-800">
                {test.name}
              </h3>

              <p className="mt-2 min-h-[40px] text-sm text-slate-500">
                {test.description ||
                  "Laboratory diagnostic test"}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                <div>
                  <p className="text-xs text-slate-400">
                    Sample
                  </p>

                  <p className="text-sm font-medium text-slate-700">
                    {test.sampleType || "—"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400">
                    Price
                  </p>

                  <p className="font-bold text-blue-600">
                    ₹{test.price ?? "—"}
                  </p>
                </div>

              </div>

              <button
                onClick={() => openBooking(test)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
              >
                <CalendarDays size={17} />
                Book Test
              </button>

            </div>

          ))}

        </div>
      )}

      {/* ================================================= */}
      {/* BOOKING MODAL */}
      {/* ================================================= */}

      {selectedTest && !confirmed && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md animate-[fadeIn_.2s_ease-out] rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-100 p-5">

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Book Laboratory Test
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedTest.name}
                </p>
              </div>

              <button
                onClick={closeBooking}
                disabled={booking}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleBook}
              className="space-y-5 p-5"
            >

              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle size={17} />
                  {error}
                </div>
              )}

              {/* Date */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Appointment Date
                </label>

                <div className="relative">

                  <CalendarDays
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    min={today}
                    value={scheduledDate}
                    onChange={(e) =>
                      setScheduledDate(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>
              </div>

              {/* Time */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Appointment Time
                </label>

                <div className="relative">

                  <Clock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) =>
                      setScheduledTime(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>
              </div>

              {/* Summary */}

              <div className="rounded-xl bg-slate-50 p-4">

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Test
                  </span>

                  <span className="font-semibold text-slate-800">
                    {selectedTest.name}
                  </span>
                </div>

                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-slate-500">
                    Sample
                  </span>

                  <span className="font-medium text-slate-700">
                    {selectedTest.sampleType || "—"}
                  </span>
                </div>

                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-slate-500">
                    Price
                  </span>

                  <span className="font-bold text-blue-600">
                    ₹{selectedTest.price ?? "—"}
                  </span>
                </div>

              </div>

              {/* Buttons */}

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={closeBooking}
                  disabled={booking}
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={booking}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {booking ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                      Booking...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}

                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* BOOKING CONFIRMATION */}
      {/* ================================================= */}

      {confirmed && selectedTest && (

        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">

            {/* Animated top section */}

            <div className="relative flex flex-col items-center overflow-hidden bg-gradient-to-b from-green-50 to-white px-6 pb-5 pt-10">

              {/* Animated circles */}

              <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-green-100 opacity-30" />

              <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-100 opacity-60" />

              {/* Check icon */}

              <div className="relative flex h-20 w-20 animate-[scaleIn_.4s_ease-out] items-center justify-center rounded-full bg-green-500 text-white shadow-lg">

                <CircleCheck
                  size={45}
                  strokeWidth={2.5}
                  className="animate-[checkPop_.5s_ease-out]"
                />

              </div>

              <h2 className="relative mt-5 text-2xl font-bold text-slate-800">
                Booking Confirmed!
              </h2>

              <p className="relative mt-2 text-center text-sm text-slate-500">
                Your laboratory test has been successfully booked.
              </p>

            </div>

            {/* Details */}

            <div className="space-y-4 p-6">

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                    <FlaskConical size={21} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Laboratory Test
                    </p>

                    <p className="font-bold text-slate-800">
                      {selectedTest.name}
                    </p>
                  </div>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-slate-50 p-3">

                  <div className="flex items-center gap-2 text-slate-400">
                    <CalendarDays size={15} />

                    <span className="text-xs">
                      Date
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {scheduledDate}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-3">

                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={15} />

                    <span className="text-xs">
                      Time
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {scheduledTime}
                  </p>

                </div>

              </div>

              {/* Order ID */}

              {(bookingResponse?.orderId ||
                bookingResponse?.id) && (

                <div className="rounded-xl border border-green-100 bg-green-50 p-3 text-center">

                  <p className="text-xs text-green-600">
                    Order ID
                  </p>

                  <p className="mt-1 font-bold text-green-700">
                    #
                    {bookingResponse.orderId ||
                      bookingResponse.id}
                  </p>

                </div>

              )}

              <div className="flex items-center gap-2 rounded-xl bg-blue-50 p-3 text-sm text-blue-700">

                <CheckCircle size={17} />

                <span>
                  Your order is now waiting for the laboratory technician.
                </span>

              </div>

              <button
                onClick={finishConfirmation}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
              >
                Done
              </button>

            </div>

          </div>

        </div>
      )}

      {/* Animation CSS */}

      <style>
        {`
          @keyframes scaleIn {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            70% {
              transform: scale(1.1);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes checkPop {
            0% {
              transform: scale(0.3);
              opacity: 0;
            }
            60% {
              transform: scale(1.15);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.97);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>

    </div>
  );
}