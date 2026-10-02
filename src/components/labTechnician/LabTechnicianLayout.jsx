import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  FlaskConical,
  Image,
  Users,
  UserRound,
  LockKeyhole,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Search,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import labTechnicianService from "../../services/labTechnicianService";
import authService from "../../services/authService";
import { getRefreshToken } from "../../utils/tokenUtils";

const menu = [
  {
    to: "/lab-technician/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/lab-technician/orders",
    label: "Lab Orders",
    icon: ClipboardList,
  },
  {
    to: "/lab-technician/my-work",
    label: "My Work",
    icon: FlaskConical,
  },
  {
    to: "/lab-technician/results",
    label: "Test Results",
    icon: FlaskConical,
  },
  {
    to: "/lab-technician/imaging",
    label: "Imaging",
    icon: Image,
  },
  {
    to: "/lab-technician/patients",
    label: "Patients",
    icon: Users,
  },
  {
    to: "/lab-technician/profile",
    label: "My Profile",
    icon: UserRound,
  },
  {
    to: "/lab-technician/change-password",
    label: "Change Password",
    icon: LockKeyhole,
  },
];

export default function LabTechnicianLayout() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchText, setSearchText] = useState("");

  // =========================
  // LOAD PROFILE
  // =========================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await labTechnicianService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error(
        "Failed to load lab technician profile:",
        error
      );

      // If token is invalid/expired,
      // send user back to Lab Technician login.
      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        navigate("/lab-technician/login", {
          replace: true,
        });
      }
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = async () => {
    try {
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error(
        "Logout API failed:",
        error
      );
    } finally {
      // Always clear local authentication
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Redirect to Lab Technician login
      navigate("/lab-technician/login", {
        replace: true,
      });
    }
  };

  // =========================
  // SEARCH
  // =========================

  const handleSearch = (e) => {
    e.preventDefault();

    const value = searchText.trim();

    if (!value) return;

    navigate(
      `/lab-technician/patients?search=${encodeURIComponent(
        value
      )}`
    );

    // Close mobile sidebar if open
    setMobileMenu(false);
  };

  return (
    <div className="min-h-screen bg-[#F6F9FC]">

      {/* =========================================
          MOBILE OVERLAY
      ========================================= */}

      {mobileMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64
          bg-[#0d1f3c] text-white
          transition-transform duration-300
          lg:translate-x-0
          ${
            mobileMenu
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="flex h-full flex-col">

          {/* =====================================
              LOGO
          ===================================== */}

          <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">

            <button
              onClick={() =>
                navigate("/lab-technician/dashboard")
              }
              className="flex items-center gap-3 text-left"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-xl font-bold">
                +
              </div>

              <div>
                <h1 className="text-xl font-bold">
                  MediCare
                </h1>

                <p className="text-[10px] text-blue-200">
                  Laboratory Management
                </p>
              </div>
            </button>

            <button
              className="lg:hidden"
              onClick={() => setMobileMenu(false)}
            >
              <X size={22} />
            </button>

          </div>

          {/* =====================================
              NAVIGATION
          ===================================== */}

          <nav className="flex-1 space-y-1 overflow-y-auto p-3">

            {menu.map(
              ({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() =>
                    setMobileMenu(false)
                  }
                  className={({ isActive }) =>
                    `
                    flex w-full items-center gap-3
                    rounded-xl px-4 py-3 text-sm
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

          {/* =====================================
              LOGOUT
          ===================================== */}

          <div className="border-t border-white/10 p-3">

            <button
              onClick={logout}
              className="
                flex w-full items-center gap-3
                rounded-xl px-4 py-3
                text-sm font-medium text-red-300
                hover:bg-red-500/10
                transition
              "
            >
              <LogOut size={19} />

              <span>Logout</span>
            </button>

          </div>

        </div>
      </aside>

      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <div className="lg:pl-64">

        {/* =====================================
            NAVBAR
        ===================================== */}

        <header
          className="
            sticky top-0 z-30
            flex min-h-20 items-center gap-3
            border-b border-slate-200
            bg-white/95 px-3
            backdrop-blur
            sm:px-5 md:px-8
          "
        >

          {/* Mobile Menu Button */}

          <button
            className="
              shrink-0 rounded-lg p-2
              text-slate-600
              lg:hidden
            "
            onClick={() =>
              setMobileMenu(true)
            }
          >
            <Menu size={24} />
          </button>

          {/* Search */}

          <form
            onSubmit={handleSearch}
            className="
              relative min-w-0 flex-1
              lg:max-w-2xl
            "
          >
            <div
              className="
                flex h-11 w-full
                items-center rounded-xl
                border border-slate-200
                bg-slate-50 px-3
                focus-within:border-blue-500
                focus-within:bg-white
                sm:h-12
              "
            >

              <Search
                size={18}
                className="shrink-0 text-slate-400"
              />

              <input
                value={searchText}
                onChange={(e) =>
                  setSearchText(e.target.value)
                }
                placeholder="Search patients..."
                className="
                  min-w-0 flex-1
                  bg-transparent px-3
                  text-sm outline-none
                  placeholder:text-slate-400
                "
              />

            </div>
          </form>

          {/* =====================================
              PROFILE
          ===================================== */}

          <div className="ml-auto flex shrink-0 items-center gap-3">

            <div className="hidden text-right sm:block">

              <p className="text-sm font-bold text-slate-800">
                {profile?.name ||
                  "Lab Technician"}
              </p>

              <p className="text-xs text-slate-500">
                Lab Technician
              </p>

            </div>

            <button
              onClick={() =>
                navigate(
                  "/lab-technician/profile"
                )
              }
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-full
                bg-blue-100
                text-blue-600
                sm:h-11 sm:w-11
              "
            >
              <UserRound size={21} />
            </button>

          </div>

        </header>

        {/* =====================================
            PAGE CONTENT
        ===================================== */}

        <main className="p-3 sm:p-5 md:p-8">

          <Outlet
            context={{
              profile,
              reloadProfile: loadProfile,
            }}
          />

        </main>

      </div>

    </div>
  );
}