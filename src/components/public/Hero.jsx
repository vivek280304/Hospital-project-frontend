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
    <section className="relative overflow-hidden bg-gradient-to-r from-[#eef6ff] via-white to-[#edf6ff]">
      {/* background decoration */}
      <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-cyan-100/40 blur-3xl" />

      <div className="relative mx-auto grid min-h-[470px] max-w-[1400px] items-center gap-10 px-8 py-12 lg:grid-cols-2">
        {/* LEFT */}
        <div>
          <div className="mb-5 inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-700">
            Trusted Healthcare Partner
          </div>

          <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.08] tracking-tight text-[#10255c] md:text-6xl">
            Your Healthcare.
            <br />
            <span className="text-blue-600">One Digital Record.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">
            Book appointments, find doctors and manage your healthcare
            journey — all in one place.
          </p>

          <div className="mt-7 flex flex-wrap gap-4">
            <a
              href="#doctor-search"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            >
              <CalendarDays size={18} />
              Find a Doctor
              <ArrowRight size={17} />
            </a>

            <Link
              to="/patient/login"
              className="rounded-lg border border-blue-200 bg-white px-7 py-3.5 text-sm font-bold text-blue-600 transition hover:bg-blue-50"
            >
              Book Appointment
            </Link>
          </div>

          {/* SMALL FEATURES */}
          <div className="mt-9 grid max-w-2xl grid-cols-3 gap-5">
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

        {/* RIGHT */}
        <div className="relative hidden h-[430px] lg:block">
          {/* doctor placeholder panel */}
          <div className="absolute bottom-0 right-10 h-[380px] w-[330px] overflow-hidden rounded-t-[170px] bg-gradient-to-b from-blue-100 to-blue-50">
            <div className="flex h-full items-center justify-center">
              <div className="flex h-48 w-48 items-center justify-center rounded-full bg-white/70 text-blue-500 shadow-xl">
                <HeartPulse size={100} strokeWidth={1.2} />
              </div>
            </div>
          </div>

          {/* 500+ */}
          <FloatingCard
            className="left-0 top-16"
            icon={<HeartPulse size={23} />}
            value="500+"
            text="Experienced Doctors"
          />

          {/* 24/7 */}
          <FloatingCard
            className="left-4 bottom-16"
            icon={<Clock3 size={23} />}
            value="24/7"
            text="Healthcare Support"
          />

          {/* Digital Reports */}
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

function MiniFeature({ icon: Icon, title, text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        <Icon size={21} />
      </div>

      <div>
        <p className="text-xs font-bold text-[#10255c]">{title}</p>
        <p className="mt-1 text-[11px] text-slate-500">{text}</p>
      </div>
    </div>
  );
}

function FloatingCard({ className, icon, value, text }) {
  return (
    <div
      className={`absolute z-10 flex items-center gap-3 rounded-2xl border border-white bg-white px-5 py-4 shadow-xl ${className}`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div>
        <p className="font-bold text-[#10255c]">{value}</p>
        <p className="text-xs text-slate-500">{text}</p>
      </div>
    </div>
  );
}

export default Hero;