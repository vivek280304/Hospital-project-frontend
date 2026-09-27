import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CircleCheck,
  Loader2,
  UserRound,
  BriefcaseBusiness,
  Stethoscope,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/public/Navbar";
import doctorService from "../../services/doctorService";

function DoctorDetails() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await doctorService.getDoctorById(doctorId);

        console.log(
          "GET /api/doctors/" + doctorId,
          data
        );

        setDoctor(data);
      } catch (error) {
        console.error("Doctor details error:", error);

        setError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load doctor."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDoctor();
  }, [doctorId]);

  /* ================= LOADING ================= */

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

  /* ================= ERROR ================= */

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-5">
        <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">

          <p className="font-semibold text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Back Home
          </button>

        </div>
      </div>
    );
  }

  if (!doctor) {
    return null;
  }

  /* ================= DOCTOR DATA ================= */

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

  const experience =
    doctor.experience ??
    doctor.yearsOfExperience;

  const email =
    doctor.email ??
    doctor.user?.email;

  /* ================= PAGE ================= */

  return (
    <div className="min-h-screen bg-[#f5f9ff]">

      {/* ================= NAVBAR ================= */}

      {/*
        Find Doctors is removed globally from Navbar.

        Logged-out patient:
        Login + Sign Up

        Logged-in patient:
        Logout
      */}
      <Navbar />

      {/* ================= BACK ================= */}

      <div className="mx-auto max-w-7xl px-5 pt-7">

        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={18} />

          Back to Doctors
        </button>

      </div>

      <main className="mx-auto max-w-7xl px-5 py-8">

        {/* ================= PROFILE ================= */}

        <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">

          {/* TOP BLUE AREA */}

          <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-500" />

          <div className="px-6 pb-8 md:px-10">

            <div className="-mt-20 flex flex-col gap-7 md:flex-row md:items-end">

              {/* ================= IMAGE ================= */}

              <div className="flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-8 border-white bg-blue-50 text-blue-500 shadow-lg">

                {doctor.image ? (
                  <img
                    src={doctor.image}
                    alt={name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound
                    size={78}
                    strokeWidth={1.3}
                  />
                )}

              </div>

              {/* ================= BASIC INFO ================= */}

              <div className="flex-1 pb-1">

                <div className="flex flex-wrap items-center gap-2">

                  {/* SPECIALIZATION */}

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                    {specialization}
                  </span>

                  {/* VERIFIED */}

                  <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                    <CircleCheck size={14} />

                    Verified Doctor
                  </span>

                </div>

                {/* NAME */}

                <h1 className="mt-3 text-3xl font-extrabold text-[#10255c] md:text-4xl">
                  {name}
                </h1>

                <p className="mt-2 text-slate-500">
                  Professional healthcare provider at MediCare
                </p>

              </div>

            </div>

            {/* ================= DETAILS ================= */}

            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              <InfoCard
                icon={Stethoscope}
                title="Specialization"
                value={specialization}
              />

              <InfoCard
                icon={BriefcaseBusiness}
                title="Experience"
                value={
                  experience != null
                    ? `${experience}+ years`
                    : "Experienced Doctor"
                }
              />

              <InfoCard
                icon={CalendarDays}
                title="Appointments"
                value="Check available slots"
              />

            </div>

          </div>
        </section>

        {/* ================= ABOUT + BOOK ================= */}

        <section className="mt-7 grid gap-7 lg:grid-cols-[1fr_380px]">

          {/* ================= ABOUT ================= */}

          <div className="rounded-3xl border border-blue-100 bg-white p-7 shadow-sm">

            <h2 className="text-xl font-bold text-[#10255c]">
              About the Doctor
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              Consult with {name}, a qualified{" "}
              {specialization.toLowerCase()} specialist.
              Select an available appointment slot to
              continue with your booking.
            </p>

            {/* EMAIL */}

            {email && (
              <div className="mt-6 border-t border-slate-100 pt-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Contact
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  {email}
                </p>

              </div>
            )}

          </div>

          {/* ================= BOOK APPOINTMENT ================= */}

          <div className="rounded-3xl bg-[#10255c] p-7 text-white shadow-lg">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
              <CalendarDays size={25} />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Book an Appointment
            </h2>

            <p className="mt-2 text-sm leading-6 text-blue-100">
              Check the doctor's available dates and
              appointment slots.
            </p>

            {/* CHECK AVAILABLE SLOTS */}

            <button
              type="button"
              onClick={() =>
                navigate(`/doctors/${doctorId}/slots`)
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-bold text-blue-600 transition hover:bg-blue-50"
            >
              Check Available Slots

              <ArrowRight size={18} />
            </button>

            <p className="mt-4 text-center text-xs text-blue-200">
              Select a date and time to continue with your appointment
            </p>

          </div>

        </section>

      </main>
    </div>
  );
}

/* ================= INFO CARD ================= */

function InfoCard({ icon: Icon, title, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <Icon size={21} />
        </div>

        <div>

          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {title}
          </p>

          <p className="mt-1 text-sm font-bold text-slate-800">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}

export default DoctorDetails;