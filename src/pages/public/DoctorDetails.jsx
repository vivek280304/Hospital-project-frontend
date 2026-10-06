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
  Mail,
  ShieldCheck,
  Clock3,
  MapPin,
  IndianRupee,
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

  // =========================================================
  // LOAD DOCTOR
  // =========================================================

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await doctorService.getDoctorById(doctorId);

        console.log("Doctor details:", data);

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

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F9FC]">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <Loader2
              size={27}
              className="animate-spin text-blue-600"
            />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Loading doctor profile...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F9FC] px-5">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl font-bold text-red-500">
            !
          </div>

          <h2 className="mt-4 font-bold text-slate-900">
            Doctor unavailable
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  if (!doctor) return null;

  // =========================================================
  // DATA
  // =========================================================

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

  const qualification =
    doctor.qualification ??
    doctor.degree ??
    doctor.education;

  // Consultation fee
  const consultationFee = doctor.consultationFee;

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-[#F7F9FC]">

      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* =====================================================
            BACK
        ===================================================== */}

        <button
          onClick={() => navigate("/")}
          className="
            mb-6
            flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-slate-500
            transition
            hover:text-blue-600
          "
        >
          <ArrowLeft size={17} />

          Back to Doctors
        </button>


        {/* =====================================================
            DOCTOR PROFILE HEADER
        ===================================================== */}

        <section
          className="
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-[0_2px_10px_rgba(15,23,42,0.04)]
          "
        >

          <div
            className="
              flex
              flex-col
              gap-6
              p-5
              sm:p-7
              md:flex-row
              md:items-center
              md:p-8
            "
          >

            {/* =================================================
                DOCTOR AVATAR
            ================================================= */}

            <div
              className="
                flex
                h-28
                w-28
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-3xl
                bg-blue-50
                text-blue-600
                sm:h-32
                sm:w-32
              "
            >

              {doctor.image ? (
                <img
                  src={doctor.image}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound
                  size={62}
                  strokeWidth={1.4}
                />
              )}

            </div>


            {/* =================================================
                PROFILE DETAILS
            ================================================= */}

            <div className="min-w-0 flex-1">

              <div className="flex flex-wrap gap-2">

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                  {specialization}
                </span>

                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                  <CircleCheck size={13} />
                  Verified
                </span>

              </div>


              <h1
                className="
                  mt-3
                  text-2xl
                  font-extrabold
                  tracking-tight
                  text-slate-900
                  sm:text-3xl
                "
              >
                {name}
              </h1>


              {qualification && (
                <p className="mt-2 text-sm font-medium text-slate-500">
                  {qualification}
                </p>
              )}


              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">

                {experience != null && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">

                    <BriefcaseBusiness
                      size={16}
                      className="text-blue-500"
                    />

                    {experience}+ years experience

                  </div>
                )}


                <div className="flex items-center gap-2 text-sm text-slate-500">

                  <ShieldCheck
                    size={16}
                    className="text-emerald-500"
                  />

                  Verified professional

                </div>

              </div>

            </div>


            {/* =================================================
                QUICK ACTION + CONSULTATION FEE
            ================================================= */}

            <div className="w-full md:w-64">

              {/* CONSULTATION FEE */}

              <div className="mb-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      Consultation Fee
                    </p>

                    <p className="mt-1 text-2xl font-extrabold text-slate-900">
                      {consultationFee != null
                        ? `₹${consultationFee}`
                        : "Not available"}
                    </p>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <IndianRupee size={20} />
                  </div>

                </div>

              </div>


              {/* CHECK AVAILABLE SLOTS */}

              <button
                onClick={() =>
                  navigate(`/doctors/${doctorId}/slots`)
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-5
                  py-3.5
                  text-sm
                  font-bold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-blue-700
                  hover:shadow-md
                "
              >
                Check Available Slots

                <ArrowRight size={17} />
              </button>


              <p className="mt-2 text-center text-[11px] text-slate-400">
                View dates & appointment times
              </p>

            </div>

          </div>

        </section>


        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div
          className="
            mt-6
            grid
            gap-6
            lg:grid-cols-[1.35fr_0.65fr]
          "
        >

          {/* ===================================================
              LEFT
          =================================================== */}

          <div className="space-y-6">

            {/* =================================================
                ABOUT
            ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_2px_10px_rgba(15,23,42,0.04)] sm:p-7">

              <SectionHeading
                icon={UserRound}
                title="About the Doctor"
              />

              <p className="mt-5 text-sm leading-7 text-slate-600">

                Consult with{" "}

                <span className="font-semibold text-slate-800">
                  {name}
                </span>

                , a qualified{" "}

                <span className="font-semibold text-blue-600">
                  {specialization.toLowerCase()}
                </span>{" "}

                specialist. You can check the doctor's
                availability and select an appointment
                slot that works for you.

              </p>

            </section>


            {/* =================================================
                PROFESSIONAL DETAILS
            ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_2px_10px_rgba(15,23,42,0.04)] sm:p-7">

              <SectionHeading
                icon={Stethoscope}
                title="Professional Details"
              />

              <div
                className="
                  mt-5
                  grid
                  gap-3
                  sm:grid-cols-2
                "
              >

                <Detail
                  icon={Stethoscope}
                  label="Specialization"
                  value={specialization}
                />

                <Detail
                  icon={BriefcaseBusiness}
                  label="Experience"
                  value={
                    experience != null
                      ? `${experience}+ years`
                      : "Not specified"
                  }
                />

                <Detail
                  icon={ShieldCheck}
                  label="Status"
                  value="Verified Doctor"
                />

                <Detail
                  icon={MapPin}
                  label="Hospital"
                  value="MediCare Hospital"
                />

              </div>

            </section>


            {/* =================================================
                CONTACT
            ================================================= */}

            {email && (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_2px_10px_rgba(15,23,42,0.04)] sm:p-7">

                <SectionHeading
                  icon={Mail}
                  title="Contact Information"
                />

                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Mail size={18} />
                  </div>

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-slate-700">
                      {email}
                    </p>

                  </div>

                </div>

              </section>
            )}

          </div>


          {/* ===================================================
              RIGHT - APPOINTMENT PANEL
          =================================================== */}

          <aside className="lg:sticky lg:top-6 lg:self-start">

            <div
              className="
                overflow-hidden
                rounded-3xl
                border
                border-blue-100
                bg-white
                shadow-[0_5px_20px_rgba(37,99,235,0.08)]
              "
            >

              {/* PANEL HEADER */}

              <div className="border-b border-slate-100 p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      Appointment
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      Book a Visit
                    </h2>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <CalendarDays size={21} />
                  </div>

                </div>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Check the doctor's schedule and choose
                  an available date and time.
                </p>

              </div>


              {/* APPOINTMENT FEATURES */}

              <div className="space-y-3 p-6">

                {/* =================================================
                    CONSULTATION FEE
                ================================================= */}

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                        Consultation Fee
                      </p>

                      <p className="mt-1 text-2xl font-extrabold text-slate-900">
                        {consultationFee != null
                          ? `₹${consultationFee}`
                          : "Not available"}
                      </p>

                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                      <IndianRupee size={21} />
                    </div>

                  </div>

                </div>


                {/* FLEXIBLE DATES */}

                <AppointmentFeature
                  icon={CalendarDays}
                  title="Flexible dates"
                  text="Choose a date that works for you"
                />


                {/* AVAILABLE TIME SLOTS */}

                <AppointmentFeature
                  icon={Clock3}
                  title="Available time slots"
                  text="See real-time appointment availability"
                />


                {/* SECURE BOOKING */}

                <AppointmentFeature
                  icon={ShieldCheck}
                  title="Secure booking"
                  text="Your appointment information is protected"
                />


                {/* PRIMARY BUTTON */}

                <button
                  onClick={() =>
                    navigate(`/doctors/${doctorId}/slots`)
                  }
                  className="
                    mt-3
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    px-5
                    py-3.5
                    text-sm
                    font-bold
                    text-white
                    transition
                    hover:bg-blue-700
                  "
                >
                  Check Available Slots

                  <ArrowRight size={18} />
                </button>


                <p className="text-center text-[11px] leading-5 text-slate-400">
                  Select your preferred date and appointment
                  time on the next screen.
                </p>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}


/* =============================================================
   SECTION HEADING
============================================================= */

function SectionHeading({
  icon: Icon,
  title,
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={19} />
      </div>

      <h2 className="text-lg font-bold text-slate-900">
        {title}
      </h2>

    </div>
  );
}


/* =============================================================
   DETAIL
============================================================= */

function Detail({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

      <div className="flex items-center gap-2">

        <Icon
          size={16}
          className="text-blue-600"
        />

        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>

      </div>

      <p className="mt-2 text-sm font-semibold text-slate-700">
        {value}
      </p>

    </div>
  );
}


/* =============================================================
   APPOINTMENT FEATURE
============================================================= */

function AppointmentFeature({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="flex gap-3 rounded-2xl bg-slate-50 p-3.5">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
        <Icon size={17} />
      </div>

      <div className="min-w-0">

        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-0.5 text-xs leading-5 text-slate-500">
          {text}
        </p>

      </div>

    </div>
  );
}


export default DoctorDetails;