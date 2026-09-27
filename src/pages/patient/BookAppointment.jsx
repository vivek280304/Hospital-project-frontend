import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../../components/public/Navbar";
import doctorService from "../../services/doctorService";
import patientService from "../../services/patientService";

function BookAppointment() {
  const navigate = useNavigate();
  const location = useLocation();

  const appointmentData = location.state;

  const [doctor, setDoctor] = useState(null);
  const [profile, setProfile] = useState(null);

  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!appointmentData?.doctorId) {
      navigate("/patient/dashboard");
      return;
    }

    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [doctorData, profileData] =
        await Promise.all([
          doctorService.getDoctorById(
            appointmentData.doctorId
          ),
          patientService.getProfile(),
        ]);

      setDoctor(doctorData);
      setProfile(profileData);
    } catch (error) {
      console.error("Booking data error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load appointment details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (booking) return;

    if (!profile) {
      setError("Patient profile could not be loaded.");
      return;
    }

    try {
      setBooking(true);
      setBookingResult(null);
      setError("");
      setSuccess("");

      const request = {
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        phoneNumber: profile.phoneNumber,

        doctorId: Number(appointmentData.doctorId),
        appointmentDate:
          appointmentData.appointmentDate,
        appointmentTime:
          appointmentData.appointmentTime,

        reason: reason.trim() || null,
      };

      console.log("Booking request:", request);

      await patientService.bookAppointment(request);

      setSuccess("Appointment booked successfully.");
      setBookingResult("success");
    } catch (error) {
      console.error("Booking error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unable to book appointment.";

      setError(message);
      setBookingResult("failed");
    } finally {
      setBooking(false);
    }
  };

  const handleTryAgain = () => {
    setBookingResult(null);
    setError("");
    setSuccess("");
  };

  const goToDashboard = () => {
    navigate("/patient/dashboard", { replace: true });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2
          size={40}
          className="animate-spin text-blue-600"
        />
      </div>
    );
  }

  if (!doctor || !profile) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center px-5">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-600">
              {error || "Unable to load appointment details."}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/patient/dashboard")
              }
              className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const doctorName =
    doctor.name ??
    doctor.fullName ??
    doctor.doctorName ??
    doctor.user?.name ??
    "Doctor";

  const specialization =
    doctor.specialization ??
    doctor.department ??
    "General Medicine";

  return (
    <div className="min-h-screen bg-[#f5f9ff]">
      {/* BOOKING RESULT / PROCESSING OVERLAY */}
      {(booking || bookingResult) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-5 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white p-8 text-center shadow-2xl">
            {booking && (
              <>
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-50">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-blue-100 border-t-blue-600">
                    <Loader2
                      size={30}
                      className="animate-spin text-blue-600"
                    />
                  </div>
                </div>

                <h2 className="mt-6 text-2xl font-bold text-[#10255c]">
                  Confirming Appointment
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                  Please wait while we confirm your appointment. This may
                  take a few moments.
                </p>

                <div className="mt-6 rounded-2xl bg-blue-50 px-4 py-3 text-xs font-medium text-blue-700">
                  Please do not close this page or press the button again.
                </div>

                <div className="mx-auto mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-1/2 animate-[bookingProgress_1.4s_ease-in-out_infinite] rounded-full bg-blue-600" />
                </div>
              </>
            )}

            {!booking && bookingResult === "success" && (
              <>
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
                  <div className="flex h-16 w-16 animate-[bookingPop_0.45s_ease-out] items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 size={40} className="text-green-600" />
                  </div>
                </div>

                <h2 className="mt-6 text-2xl font-bold text-slate-900">
                  Appointment Confirmed!
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Your appointment has been booked successfully.
                </p>

                <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-4 text-left">
                  <p className="text-xs font-medium text-green-700">
                    Appointment Details
                  </p>

                  <p className="mt-2 font-semibold text-slate-900">
                    {doctorName}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {appointmentData.appointmentDate}
                    {" · "}
                    {appointmentData.appointmentTime}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={goToDashboard}
                  className="mt-6 w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Go to Dashboard
                </button>
              </>
            )}

            {!booking && bookingResult === "failed" && (
              <>
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
                  <div className="flex h-16 w-16 animate-[bookingPop_0.45s_ease-out] items-center justify-center rounded-full bg-red-100">
                    <XCircle size={40} className="text-red-600" />
                  </div>
                </div>

                <h2 className="mt-6 text-2xl font-bold text-slate-900">
                  Booking Failed
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  We could not confirm this appointment.
                </p>

                <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-left">
                  <p className="text-xs font-semibold text-red-700">
                    Server Response
                  </p>
                  <p className="mt-2 text-sm leading-5 text-red-600">
                    {error || "Please try another available slot."}
                  </p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleTryAgain}
                    className="rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Try Again
                  </button>

                  <button
                    type="button"
                    onClick={goToDashboard}
                    className="rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Dashboard
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes bookingPop {
          0% {
            transform: scale(0.65);
            opacity: 0;
          }
          70% {
            transform: scale(1.08);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bookingProgress {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(220%);
          }
        }
      `}</style>
      <Navbar />

      <main className="mx-auto max-w-5xl px-5 py-8">

        {/* BACK */}
        <button
          type="button"
          onClick={() =>
            navigate(
              `/doctors/${appointmentData.doctorId}/slots`
            )
          }
          className="mb-7 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to Slots
        </button>

        <div className="grid gap-7 lg:grid-cols-[1fr_400px]">

          {/* LEFT */}
          <section className="rounded-3xl border border-blue-100 bg-white p-7 shadow-sm">

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Stethoscope size={24} />
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Appointment Booking
                </p>

                <h1 className="text-2xl font-bold text-[#10255c]">
                  Confirm Appointment
                </h1>
              </div>
            </div>

            {/* DOCTOR */}
            <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  {doctor.image ? (
                    <img
                      src={doctor.image}
                      alt={doctorName}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    <UserRound size={28} />
                  )}
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    {doctorName}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {specialization}
                  </p>
                </div>

              </div>
            </div>

            {/* APPOINTMENT DETAILS */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-3">
                  <CalendarDays
                    size={20}
                    className="text-blue-600"
                  />

                  <div>
                    <p className="text-xs text-slate-500">
                      Appointment Date
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {appointmentData.appointmentDate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-3">
                  <Clock
                    size={20}
                    className="text-blue-600"
                  />

                  <div>
                    <p className="text-xs text-slate-500">
                      Appointment Time
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {appointmentData.appointmentTime}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* PATIENT DETAILS */}
            <div className="mt-7">
              <h2 className="text-lg font-bold text-[#10255c]">
                Patient Details
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">

                <div>
                  <p className="text-xs text-slate-500">
                    Name
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {profile.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Email
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {profile.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Date of Birth
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {profile.dateOfBirth || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Gender
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {profile.gender || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Phone
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {profile.phoneNumber || "Not provided"}
                  </p>
                </div>

              </div>
            </div>

            {/* REASON */}
            <div className="mt-7">
              <label className="text-sm font-semibold text-slate-700">
                Reason for Visit
                <span className="ml-1 font-normal text-slate-400">
                  (optional)
                </span>
              </label>

              <textarea
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
                rows={4}
                placeholder="Briefly describe your reason for visiting..."
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                <CheckCircle2 size={20} />
                {success}
              </div>
            )}

            {/* BOOK */}
            <form onSubmit={handleBooking}>
              <button
                type="submit"
                disabled={booking || !!success || !!bookingResult}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {booking ? (
                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />
                    Booking Appointment...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    Confirm Appointment
                  </>
                )}
              </button>
            </form>

          </section>

          {/* RIGHT */}
          <aside className="h-fit rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold text-[#10255c]">
              Appointment Summary
            </h2>

            <div className="mt-6 space-y-5">

              <div>
                <p className="text-xs text-slate-500">
                  Doctor
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {doctorName}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Specialization
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {specialization}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Date
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {appointmentData.appointmentDate}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Time
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {appointmentData.appointmentTime}
                </p>
              </div>

            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-xs leading-5 text-slate-500">
                Please verify your appointment details
                before confirming your booking.
              </p>
            </div>

          </aside>

        </div>
      </main>
    </div>
  );
}

export default BookAppointment;