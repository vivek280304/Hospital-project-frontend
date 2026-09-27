import { Link } from "react-router-dom";
import { Search, HeartPulse } from "lucide-react";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-5">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <HeartPulse size={25} />
          </div>

          <div>
            <h1 className="text-xl font-bold leading-none text-[#10255c]">
              MediCare
            </h1>

            <p className="mt-1 text-[11px] text-slate-500">
              Hospital Management
            </p>
          </div>
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="border-b-2 border-blue-600 py-7 text-sm font-semibold text-blue-600"
          >
            Home
          </Link>

          <a
            href="#doctor-search"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Find Doctors
          </a>

          <a
            href="#features"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Services
          </a>

          <a
            href="#about"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            About
          </a>

          <a
            href="#footer"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Contact
          </a>
        </nav>

        {/* SEARCH + AUTH */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 lg:flex">
            <Search size={16} className="text-slate-400" />

            <input
              type="text"
              placeholder="Search doctors, departments..."
              className="w-40 bg-transparent text-xs outline-none placeholder:text-slate-400"
            />
          </div>

          <Link
            to="/patient/login"
            className="rounded-lg border border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Login
          </Link>

          <Link
            to="/patient/register"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;