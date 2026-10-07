import { Link } from "react-router-dom";

import {
  ArrowRight,
  CalendarDays,
  Clock3,
  FileText,
  ShieldCheck,
  HeartPulse,
} from "lucide-react";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#eef6ff] via-white to-[#edf6ff]">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-cyan-100/40 blur-3xl" />


      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="relative mx-auto grid w-full max-w-[1400px] items-center gap-10 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-2 lg:px-8 lg:py-14">

        {/* =================================================
            LEFT
        ================================================= */}

        <div className="min-w-0">

          {/* BADGE */}

          <div className="mb-5 inline-flex max-w-full items-center rounded-full bg-blue-100 px-3.5 py-2 text-[11px] font-bold text-blue-700 sm:px-4 sm:text-xs">
            Trusted Healthcare Partner
          </div>


          {/* HEADING */}

          <h1
            className="
              max-w-[760px]
              text-[44px]
              font-black
              leading-[0.96]
              tracking-[-0.045em]
              text-[#10255c]
              min-[390px]:text-[48px]
              sm:text-6xl
              sm:leading-[0.98]
              lg:text-7xl
              xl:text-[78px]
            "
          >
            Your Healthcare.
            <br />

            <span className="text-blue-600">
              One Digital Record.
            </span>
          </h1>


          {/* DESCRIPTION */}

          <p
            className="
              mt-6
              max-w-[620px]
              text-[15px]
              leading-7
              text-slate-500
              sm:text-lg
              sm:leading-8
            "
          >
            Book appointments, find doctors and manage
            your healthcare journey — all in one place.
          </p>


          {/* =================================================
              HERO BUTTONS
          ================================================= */}

          <div className="mt-7 grid w-full gap-3 sm:flex sm:w-auto">

            {/* FIND DOCTOR */}

            <a
              href="#doctor-search"
              className="
                flex
                min-h-[50px]
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-600
                px-5
                py-3
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-blue-200
                transition
                hover:bg-blue-700
                sm:w-auto
                sm:px-6
                sm:py-3.5
              "
            >
              <CalendarDays size={18} />

              <span>
                Find a Doctor
              </span>

              <ArrowRight size={17} />
            </a>


            {/* BOOK APPOINTMENT */}

            <Link
              to="/patient/login"
              className="
                flex
                min-h-[50px]
                w-full
                items-center
                justify-center
                rounded-xl
                border
                border-blue-200
                bg-white
                px-5
                py-3
                text-sm
                font-bold
                text-blue-600
                transition
                hover:bg-blue-50
                sm:w-auto
                sm:px-6
                sm:py-3.5
              "
            >
              Book Appointment
            </Link>

          </div>


          {/* =================================================
              SMALL FEATURES
          ================================================= */}

          <div
            id="features"
            className="
              mt-9
              grid
              w-full
              grid-cols-1
              gap-3
              sm:grid-cols-3
              sm:gap-5
            "
          >

            <MiniFeature
              icon={ShieldCheck}
              title="Secure Records"
              text="Your data is safe"
            />

            <MiniFeature
              icon={CalendarDays}
              title="Easy Appointments"
              text="Book in minutes"
            />

            <MiniFeature
              icon={FileText}
              title="Paperless System"
              text="Digital health records"
            />

          </div>

        </div>


        {/* =================================================
            RIGHT
        ================================================= */}

        <div className="relative hidden h-[430px] lg:block">

          {/* DOCTOR PLACEHOLDER */}

          <div className="absolute bottom-0 right-10 h-[380px] w-[330px] overflow-hidden rounded-t-[170px] bg-gradient-to-b from-blue-100 to-blue-50">

            <div className="flex h-full items-center justify-center">

              <div className="flex h-48 w-48 items-center justify-center rounded-full bg-white/70 text-blue-500 shadow-xl">

                <HeartPulse
                  size={100}
                  strokeWidth={1.2}
                />

              </div>

            </div>

          </div>


          {/* EXPERIENCED DOCTORS */}

          <FloatingCard
            className="left-0 top-16"
            icon={<HeartPulse size={23} />}
            value="Experienced Doctors"
          />


          {/* 24/7 */}

          <FloatingCard
            className="bottom-16 left-4"
            icon={<Clock3 size={23} />}
            value="24/7"
            text="Booking Support"
          />


          {/* DIGITAL REPORTS */}

          <FloatingCard
            className="right-0 top-28"
            icon={<FileText size={23} />}
            value="Digital"
            text="Medical Reports"
          />

        </div>

      </div>

    </section>
  );
}


/* =========================================================
   MINI FEATURE
========================================================= */

function MiniFeature({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div
      className="
        flex
        min-w-0
        items-center
        gap-3
        rounded-2xl
        border
        border-blue-100/70
        bg-white/60
        p-3.5
        sm:border-0
        sm:bg-transparent
        sm:p-0
      "
    >

      {/* ICON */}

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        <Icon size={20} />
      </div>


      {/* TEXT */}

      <div className="min-w-0">

        <p className="text-sm font-bold leading-5 text-[#10255c]">
          {title}
        </p>

        <p className="mt-0.5 text-xs leading-5 text-slate-500">
          {text}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   FLOATING CARD
========================================================= */

function FloatingCard({
  className,
  icon,
  value,
  text,
}) {
  return (
    <div
      className={`
        absolute
        z-10
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-white
        bg-white
        px-5
        py-4
        shadow-xl
        ${className}
      `}
    >

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div className="whitespace-nowrap">

        <p className="font-bold text-[#10255c]">
          {value}
        </p>

        {text && (
          <p className="text-xs text-slate-500">
            {text}
          </p>
        )}

      </div>

    </div>
  );
}

export default Hero;