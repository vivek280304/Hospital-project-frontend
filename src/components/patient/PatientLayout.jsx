import { useEffect, useState, useMemo, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  FileText,
  FlaskConical,
  ClipboardList,
  Image,
  Search,
  UserRound,
  LockKeyhole,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ChevronRight,
  Stethoscope,
  Loader2,
} from "lucide-react";

import patientService from "../../services/patientService";
import doctorService from "../../services/doctorService";
import authService from "../../services/authService";
import { getRefreshToken } from "../../utils/tokenUtils";

const menu = [
  {
    to: "/patient/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/patient/appointments",
    label: "My Appointments",
    icon: CalendarDays,
  },
  {
    to: "/patient/reports",
    label: "Medical Reports",
    icon: FileText,
  },
  {
    to: "/patient/lab-tests",
    label: "Lab Tests",
    icon: FlaskConical,
  },
  {
    to: "/patient/lab-orders",
    label: "Lab Orders",
    icon: ClipboardList,
  },
  {
    to: "/patient/imaging",
    label: "Imaging",
    icon: Image,
  },
  {
    to: "/patient/doctors",
    label: "All Doctors",
    icon: Stethoscope,
  },
  {
    to: "/patient/profile",
    label: "My Profile",
    icon: UserRound,
  },
  {
    to: "/patient/change-password",
    label: "Change Password",
    icon: LockKeyhole,
  },
];

export default function PatientLayout() {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  // =========================================================
  // DOCTOR SEARCH
  // =========================================================

  const [searchText, setSearchText] = useState("");
  const [allDoctors, setAllDoctors] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // =========================================================
  // LOAD PROFILE
  // =========================================================

  useEffect(() => {
    patientService
      .getProfile()
      .then(setProfile)
      .catch(console.error);
  }, []);

  // =========================================================
  // LOAD DOCTORS
  // =========================================================

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setSearching(true);

        const data = await doctorService.getDoctors("");

        let doctors = [];

        if (Array.isArray(data)) {
          doctors = data;
        } else if (Array.isArray(data?.doctors)) {
          doctors = data.doctors;
        } else if (Array.isArray(data?.data)) {
          doctors = data.data;
        }

        setAllDoctors(doctors);
      } catch (error) {
        console.error(
          "Unable to load doctors:",
          error
        );

        setAllDoctors([]);
      } finally {
        setSearching(false);
      }
    };

    loadDoctors();
  }, []);

  // =========================================================
  // NORMALIZE DOCTOR DATA
  // =========================================================

  const doctors = useMemo(() => {
    return allDoctors.map((doctor) => ({
      id:
        doctor.id ??
        doctor.doctorId ??
        doctor.userId,

      name:
        doctor.name ??
        doctor.fullName ??
        doctor.doctorName ??
        doctor.user?.name ??
        "Doctor",

      specialization:
        doctor.specialization ??
        doctor.department ??
        "General Medicine",

      department:
        doctor.department ??
        doctor.specialization ??
        "",
    }));
  }, [allDoctors]);

  // =========================================================
  // FILTER SUGGESTIONS
  // =========================================================

  const suggestions = useMemo(() => {
    const query = searchText
      .trim()
      .toLowerCase();

    if (!query) {
      return [];
    }

    return doctors
      .filter((doctor) => {
        const name =
          doctor.name.toLowerCase();

        const specialization =
          doctor.specialization.toLowerCase();

        const department =
          doctor.department.toLowerCase();

        return (
          name.includes(query) ||
          specialization.includes(query) ||
          department.includes(query)
        );
      })
      .slice(0, 6);
  }, [searchText, doctors]);

  // =========================================================
  // SHOW/HIDE RESULTS
  // =========================================================

  useEffect(() => {
    if (searchText.trim().length > 0) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchText]);

  // =========================================================
  // CLOSE SEARCH WHEN CLICKING OUTSIDE
  // =========================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // =========================================================
  // SELECT DOCTOR
  // =========================================================

  const selectDoctor = (doctor) => {
    if (!doctor.id) {
      return;
    }

    setSearchText("");
    setShowResults(false);

    /*
     * If your doctor details route is different,
     * change this path.
     */
    navigate(`/doctors/${doctor.id}`);
  };

  // =========================================================
  // KEYBOARD
  // =========================================================

  const handleSearchKeyDown = (event) => {
    if (event.key === "Escape") {
      setShowResults(false);
      return;
    }

    if (
      event.key === "Enter" &&
      suggestions.length > 0
    ) {
      selectDoctor(suggestions[0]);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = async () => {
    try {
      await authService.logout(
        getRefreshToken()
      );
    } finally {
      window.location.href =
        "/patient/login";
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#f4f8ff]">

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {mobileMenu && (
        <div
          className="
            fixed
            inset-0
            z-40
            bg-black/40
            lg:hidden
          "
          onClick={() =>
            setMobileMenu(false)
          }
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          w-64
          bg-[#0d1f3c]
          text-white
          transition-transform
          duration-300

          lg:translate-x-0

          ${
            mobileMenu
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="flex h-full flex-col">

          {/* LOGO */}

          <div
            className="
              flex
              h-20
              items-center
              justify-between
              border-b
              border-white/10
              px-5
            "
          >
            <button
              onClick={() =>
                navigate(
                  "/patient/dashboard"
                )
              }
              className="
                flex
                items-center
                gap-3
                text-left
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-500
                  text-xl
                  font-bold
                "
              >
                +
              </div>

              <div>
                <h1 className="text-xl font-bold">
                  MediCare
                </h1>

                <p className="text-[10px] text-blue-200">
                  Hospital Management
                </p>
              </div>
            </button>

            <button
              className="lg:hidden"
              onClick={() =>
                setMobileMenu(false)
              }
            >
              <X size={22} />
            </button>
          </div>

          {/* NAVIGATION */}

          <nav
            className="
              flex-1
              space-y-1
              overflow-y-auto
              p-3
            "
          >
            {menu.map(
              ({
                to,
                label,
                icon: Icon,
              }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() =>
                    setMobileMenu(false)
                  }
                  className={({
                    isActive,
                  }) =>
                    `
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    transition

                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                        : "text-blue-100 hover:bg-white/10"
                    }
                  `
                  }
                >
                  <Icon size={19} />

                  <span>{label}</span>

                  <ChevronRight
                    size={15}
                    className="ml-auto opacity-60"
                  />
                </NavLink>
              )
            )}
          </nav>

          {/* LOGOUT */}

          <div
            className="
              border-t
              border-white/10
              p-3
            "
          >
            <button
              onClick={logout}
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-sm
                font-medium
                text-red-300
                hover:bg-red-500/10
              "
            >
              <LogOut size={19} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="lg:pl-64">

        {/* ===================================================
            NAVBAR
        =================================================== */}

        <header
          className="
            sticky
            top-0
            z-30
            flex
            min-h-20
            items-center
            gap-2
            border-b
            border-slate-200
            bg-white/95
            px-3
            backdrop-blur

            sm:gap-3
            sm:px-5

            md:px-8
          "
        >

          {/* MOBILE MENU */}

          <button
            className="
              shrink-0
              rounded-lg
              p-2
              text-slate-600
              lg:hidden
            "
            onClick={() =>
              setMobileMenu(true)
            }
          >
            <Menu size={24} />
          </button>

          {/* =================================================
              DOCTOR SEARCH
          ================================================= */}

          <div
            ref={searchRef}
            className="
              relative
              min-w-0
              flex-1

              lg:max-w-2xl
            "
          >

            {/* SEARCH BOX */}

            <div
              className="
                flex
                h-11
                w-full
                items-center
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-2
                transition

                focus-within:border-blue-500
                focus-within:bg-white
                focus-within:ring-4
                focus-within:ring-blue-500/10

                sm:h-12
                sm:px-3
              "
            >

              <Search
                size={17}
                className="
                  shrink-0
                  text-slate-400
                "
              />

              <input
                value={searchText}
                onChange={(event) => {
                  setSearchText(
                    event.target.value
                  );

                  setShowResults(
                    event.target.value.trim()
                      .length > 0
                  );
                }}
                onFocus={() => {
                  if (
                    searchText.trim()
                      .length > 0
                  ) {
                    setShowResults(true);
                  }
                }}
                onKeyDown={
                  handleSearchKeyDown
                }
                placeholder="Search doctors..."
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  px-2
                  text-sm
                  outline-none
                  placeholder:text-slate-400
                "
              />

              {/* LOADING */}

              {searching && (
                <Loader2
                  size={16}
                  className="
                    mr-2
                    shrink-0
                    animate-spin
                    text-blue-500
                  "
                />
              )}

              {/* CLEAR */}

              {searchText && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchText("");
                    setShowResults(false);
                  }}
                  className="
                    mr-1
                    rounded-full
                    p-1
                    text-slate-400
                    hover:bg-slate-200
                    hover:text-slate-600
                  "
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* =================================================
                SUGGESTIONS DROPDOWN
            ================================================= */}

            {showResults &&
              searchText.trim() && (
                <div
                  className="
                    absolute
                    left-0
                    right-0
                    top-[calc(100%+8px)]
                    z-[100]
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-[0_12px_35px_rgba(15,23,42,0.15)]
                  "
                >

                  {/* HEADER */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      border-b
                      border-slate-100
                      px-4
                      py-3
                    "
                  >
                    <div>
                      <p
                        className="
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-slate-400
                        "
                      >
                        Doctor Search
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {suggestions.length > 0
                          ? `${suggestions.length} matching doctor${
                              suggestions.length > 1
                                ? "s"
                                : ""
                            }`
                          : "No matching doctors"}
                      </p>
                    </div>

                    {suggestions.length > 0 && (
                      <span className="hidden text-[10px] text-slate-400 sm:block">
                        Enter to open
                      </span>
                    )}
                  </div>

                  {/* RESULTS */}

                  {suggestions.length > 0 ? (
                    <div className="max-h-[360px] overflow-y-auto p-2">

                      {suggestions.map(
                        (doctor) => (
                          <button
                            key={
                              doctor.id
                            }
                            type="button"
                            onClick={() =>
                              selectDoctor(
                                doctor
                              )
                            }
                            className="
                              group
                              flex
                              w-full
                              items-center
                              gap-3
                              rounded-xl
                              p-3
                              text-left
                              transition

                              hover:bg-blue-50
                            "
                          >

                            {/* AVATAR */}

                            <div
                              className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-50
                                text-blue-600
                              "
                            >
                              <UserRound
                                size={18}
                              />
                            </div>

                            {/* DETAILS */}

                            <div className="min-w-0 flex-1">

                              <p
                                className="
                                  truncate
                                  text-sm
                                  font-bold
                                  text-slate-800
                                "
                              >
                                {doctor.name}
                              </p>

                              <div
                                className="
                                  mt-1
                                  flex
                                  items-center
                                  gap-1.5
                                "
                              >
                                <Stethoscope
                                  size={13}
                                  className="text-blue-500"
                                />

                                <p
                                  className="
                                    truncate
                                    text-xs
                                    font-medium
                                    text-blue-600
                                  "
                                >
                                  {
                                    doctor.specialization
                                  }
                                </p>
                              </div>

                            </div>

                            <ChevronRight
                              size={17}
                              className="
                                shrink-0
                                text-slate-300
                                transition

                                group-hover:translate-x-0.5
                                group-hover:text-blue-600
                              "
                            />
                          </button>
                        )
                      )}

                    </div>
                  ) : (

                    /* NO RESULTS */

                    <div className="px-5 py-8 text-center">

                      <div
                        className="
                          mx-auto
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          rounded-2xl
                          bg-slate-50
                          text-slate-400
                        "
                      >
                        <Search size={20} />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-slate-700">
                        No doctors found
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Try a doctor name or specialization
                      </p>

                    </div>
                  )}

                </div>
              )}
          </div>

          {/* =================================================
              PROFILE
          ================================================= */}

          <div
            className="
              ml-auto
              flex
              shrink-0
              items-center
              gap-2

              sm:gap-3
            "
          >
            <div className="hidden text-right sm:block">

              <p className="text-sm font-bold text-slate-800">
                {profile?.name ||
                  "Patient"}
              </p>

              <p className="text-xs text-slate-500">
                Patient
              </p>

            </div>

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-blue-100
                text-blue-600

                sm:h-11
                sm:w-11
              "
            >
              <UserRound size={21} />
            </div>
          </div>

        </header>

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <main className="p-3 sm:p-5 md:p-8">
          <Outlet context={{ profile }} />
        </main>

      </div>
    </div>
  );
}