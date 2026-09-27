import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Loader2,
  UserRound,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/public/Navbar";
import doctorService from "../../services/doctorService";

function DoctorSlots() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDoctor();
  }, [doctorId]);

  const loadDoctor = async () => {
    try {
      setLoadingDoctor(true);
      setError("");

      const data = await doctorService.getDoctorById(doctorId);

      setDoctor(data);
    } catch (error) {
      console.error("Doctor error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load doctor."
      );
    } finally {
      setLoadingDoctor(false);
    }
  };

  const loadSlots = async (selectedDate) => {
    setDate(selectedDate);

    if (!selectedDate) {
      setSlots([]);
      return;
    }

    try {
      setLoadingSlots(true);
      setError("");

      const data = await doctorService.getAvailableSlots(
        doctorId,
        selectedDate
      );

      console.log(
        "Available slots:",
        data
      );

      if (Array.isArray(data)) {
        setSlots(data);
      } else if (Array.isArray(data?.slots)) {
        setSlots(data.slots);
      } else if (Array.isArray(data?.data)) {
        setSlots(data.data);
      } else {
        setSlots([]);
      }
    } catch (error) {
      console.error("Slots error:", error);

      setSlots([]);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load available slots."
      );
    } finally {
      setLoadingSlots(false);
    }
  };

  const formatSlot = (slot) => {
    if (typeof slot === "string") {
      return slot;
    }

    return (
      slot?.time ??
      slot?.appointmentTime ??
      slot?.startTime ??
      String(slot)
    );
  };

  if (loadingDoctor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2
          size={40}
          className="animate-spin text-blue-600"
        />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-red-600">
          {error || "Doctor not found."}
        </p>
      </div>
    );
  }

  const name =
    doctor.name ??
    doctor.fullName ??
    doctor.doctorName ??
    doctor.user?.name ??
    "Doctor";

  const specialization =
    doctor.specialization ??
    doctor.department ??
    "General Medicine";

  const today = new Date()
    .toISOString()
    .split("T")[0];

  return (
    <div className="min-h-screen bg-[#f5f9ff]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-8">

        {/* BACK */}
        <button
          type="button"
          onClick={() =>
            navigate(`/doctors/${doctorId}`)
          }
          className="mb-7 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to Doctor
        </button>

        {/* DOCTOR HEADER */}
        <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-50 text-blue-500">
              {doctor.image ? (
                <img
                  src={doctor.image}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound size={38} />
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-blue-600">
                Book Appointment
              </p>

              <h1 className="mt-1 text-2xl font-bold text-[#10255c]">
                {name}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {specialization}
              </p>
            </div>

          </div>
        </section>

        {/* DATE + SLOTS */}
        <section className="mt-7 grid gap-7 lg:grid-cols-[360px_1fr]">

          {/* DATE */}
          <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CalendarDays size={22} />
              </div>

              <div>
                <h2 className="font-bold text-[#10255c]">
                  Select Date
                </h2>

                <p className="text-xs text-slate-500">
                  Choose your appointment date
                </p>
              </div>
            </div>

            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) =>
                loadSlots(e.target.value)
              }
              className="mt-6 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* SLOTS */}
          <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Clock size={22} />
              </div>

              <div>
                <h2 className="font-bold text-[#10255c]">
                  Available Time Slots
                </h2>

                <p className="text-xs text-slate-500">
                  {date
                    ? `Available appointments for ${date}`
                    : "Select a date first"}
                </p>
              </div>
            </div>

            {!date && (
              <div className="mt-10 text-center">
                <CalendarDays
                  size={40}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm text-slate-500">
                  Select a date to see available slots.
                </p>
              </div>
            )}

            {date && loadingSlots && (
              <div className="flex justify-center py-12">
                <Loader2
                  size={32}
                  className="animate-spin text-blue-600"
                />
              </div>
            )}

            {date &&
              !loadingSlots &&
              error && (
                <div className="mt-7 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

            {date &&
              !loadingSlots &&
              !error &&
              slots.length === 0 && (
                <div className="mt-10 text-center">
                  <p className="text-sm text-slate-500">
                    No available slots for this date.
                  </p>
                </div>
              )}

            {date &&
              !loadingSlots &&
              !error &&
              slots.length > 0 && (
                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {slots.map((slot, index) => {
                    const time = formatSlot(slot);

                    return (
                      <button
                        key={`${time}-${index}`}
                        type="button"
                        onClick={() =>
                          navigate("/patient/login")
                        }
                        className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              )}

          </div>
        </section>

      </main>
    </div>
  );
}

export default DoctorSlots;