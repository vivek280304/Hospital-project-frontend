import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  HeartPulse,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /*
   * Check whether patient is logged in
   */
  const checkLoginStatus = () => {
    const tokenKeys = [
      "token",
      "accessToken",
      "access_token",
      "jwt",
      "jwtToken",
    ];

    const loggedIn = tokenKeys.some((key) => {
      const token = localStorage.getItem(key);

      return (
        token &&
        token !== "null" &&
        token !== "undefined"
      );
    });

    setIsLoggedIn(loggedIn);
  };

  /*
   * Check login status whenever the page/route changes.
   *
   * This is important because localStorage "storage"
   * event does not fire in the same browser tab.
   */
  useEffect(() => {
    checkLoginStatus();
  }, [location.pathname]);

  /*
   * Also listen for localStorage changes from another tab.
   */
  useEffect(() => {
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  /*
   * Logout
   */
  const handleLogout = () => {
    /*
     * Remove all possible authentication tokens.
     */
    const tokenKeys = [
      "token",
      "accessToken",
      "access_token",
      "jwt",
      "jwtToken",
      "refreshToken",
      "refresh_token",
    ];

    tokenKeys.forEach((key) => {
      localStorage.removeItem(key);
    });

    /*
     * Also remove authentication information
     * if your application uses sessionStorage.
     */
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("jwtToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("refresh_token");

    /*
     * Update Navbar immediately.
     */
    setIsLoggedIn(false);

    /*
     * Go back to Home.
     */
    navigate("/", {
      replace: true,
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-5">

        {/* ================= LOGO ================= */}

        <Link
          to="/"
          className="flex items-center gap-3"
        >
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

        {/* ================= NAVIGATION ================= */}

        <nav className="hidden items-center gap-8 md:flex">

          {/* HOME */}

          <Link
            to="/"
            className="border-b-2 border-blue-600 py-7 text-sm font-semibold text-blue-600"
          >
            Home
          </Link>

          {/* FIND DOCTORS REMOVED */}

          {/* SERVICES */}

          <a
            href="#features"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Services
          </a>

          {/* ABOUT */}

          <a
            href="#about"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            About
          </a>

          {/* CONTACT */}

          <a
            href="#footer"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Contact
          </a>

        </nav>

        {/* ================= AUTH ================= */}

        {!isLoggedIn ? (

          /*
           * LOGGED OUT
           *
           * Show Login + Sign Up
           */

          <div className="flex items-center gap-3">

            {/* LOGIN */}

            <Link
              to="/patient/login"
              className="rounded-lg border border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Login
            </Link>

            {/* SIGN UP */}

            <Link
              to="/patient/register"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Sign Up
            </Link>

          </div>

        ) : (

          /*
           * LOGGED IN
           *
           * Show Dashboard + Logout
           */

          <div className="flex items-center gap-3">

            {/* DASHBOARD */}

            <Link
              to="/patient/dashboard"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <LayoutDashboard size={17} />

              Dashboard
            </Link>

            {/* LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <LogOut size={17} />

              Logout
            </button>

          </div>

        )}

      </div>
    </header>
  );
}

export default Navbar;