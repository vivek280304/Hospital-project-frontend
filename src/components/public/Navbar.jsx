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

  /* =====================================================
     CHECK LOGIN STATUS
  ===================================================== */

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

  /* =====================================================
     CHECK WHEN ROUTE CHANGES
  ===================================================== */

  useEffect(() => {
    checkLoginStatus();
  }, [location.pathname]);

  /* =====================================================
     LISTEN FOR OTHER TABS
  ===================================================== */

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

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
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

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("jwtToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("refresh_token");

    setIsLoggedIn(false);

    navigate("/", {
      replace: true,
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur">

      <div className="mx-auto flex h-[72px] w-full max-w-[1400px] items-center justify-between px-3 sm:h-[76px] sm:px-5 lg:px-8">

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3"
        >

          {/* LOGO ICON */}

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm sm:h-11 sm:w-11">
            <HeartPulse
              size={22}
              className="sm:hidden"
            />

            <HeartPulse
              size={25}
              className="hidden sm:block"
            />
          </div>


          {/* LOGO TEXT */}

          <div className="min-w-0">

            <h1 className="text-[18px] font-extrabold leading-none tracking-tight text-[#10255c] sm:text-xl">
              MediCare
            </h1>

            <p className="mt-1 hidden text-[10px] font-medium leading-3 text-slate-500 min-[400px]:block sm:text-[11px]">
              Hospital Management
            </p>

          </div>

        </Link>


        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav className="hidden items-center gap-7 md:flex lg:gap-9">

          {/* HOME */}

          <Link
            to="/"
            className={`py-7 text-sm font-semibold transition ${
              location.pathname === "/"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-600 hover:text-blue-600"
            }`}
          >
            Home
          </Link>


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


        {/* =================================================
            AUTH
        ================================================= */}

        {!isLoggedIn ? (

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">

            {/* LOGIN */}

            <Link
              to="/patient/login"
              className="
                flex
                h-10
                items-center
                justify-center
                rounded-xl
                border
                border-blue-600
                px-3
                text-xs
                font-bold
                text-blue-600
                transition
                hover:bg-blue-50
                min-[400px]:px-4
                sm:h-11
                sm:px-5
                sm:text-sm
              "
            >
              Login
            </Link>


            {/* SIGN UP */}

            <Link
              to="/patient/register"
              className="
                flex
                h-10
                items-center
                justify-center
                rounded-xl
                bg-blue-600
                px-3
                text-xs
                font-bold
                text-white
                shadow-sm
                transition
                hover:bg-blue-700
                min-[400px]:px-4
                sm:h-11
                sm:px-5
                sm:text-sm
              "
            >
              Sign Up
            </Link>

          </div>

        ) : (

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">

            {/* DASHBOARD */}

            <Link
              to="/patient/dashboard"
              className="
                flex
                h-10
                items-center
                justify-center
                gap-1.5
                rounded-xl
                bg-blue-600
                px-3
                text-xs
                font-bold
                text-white
                transition
                hover:bg-blue-700
                sm:h-11
                sm:gap-2
                sm:px-5
                sm:text-sm
              "
            >
              <LayoutDashboard size={16} />

              <span>
                Dashboard
              </span>
            </Link>


            {/* LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              className="
                flex
                h-10
                items-center
                justify-center
                gap-1.5
                rounded-xl
                bg-red-50
                px-3
                text-xs
                font-bold
                text-red-600
                transition
                hover:bg-red-100
                sm:h-11
                sm:gap-2
                sm:px-5
                sm:text-sm
              "
            >
              <LogOut size={16} />

              <span>
                Logout
              </span>
            </button>

          </div>

        )}

      </div>

    </header>
  );
}

export default Navbar;