import { useEffect, useState } from "react";
import {
  Menu,
  Bell,
  ChevronDown,
  ShieldCheck,
  UserCircle,
  LockKeyhole,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import adminService from "../../services/adminService";

function AdminHeader({ onMenuClick }) {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);

  const [admin, setAdmin] = useState({
    name: "Admin",
    email: "",
    role: "ADMIN",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminProfile = async () => {
      try {
        setLoading(true);

        const data = await adminService.getProfile();

        console.log("ADMIN PROFILE:", data);

        setAdmin({
          name: data?.name || "Admin",
          email: data?.email || "",
          role: data?.role || "ADMIN",
        });
      } catch (error) {
        console.error(
          "ADMIN PROFILE ERROR:",
          error
        );

        /*
         * Fallback to localStorage if profile API fails.
         */
        try {
          const storedUser =
            localStorage.getItem("user");

          if (storedUser) {
            const user = JSON.parse(storedUser);

            setAdmin({
              name: user?.name || "Admin",
              email: user?.email || "",
              role: user?.role || "ADMIN",
            });
          }
        } catch (storageError) {
          console.error(
            "LOCAL USER ERROR:",
            storageError
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadAdminProfile();
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">

      {/* ========================================
          LEFT
      ======================================== */}

      <div className="flex items-center gap-3">

        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
        >
          <Menu size={23} />
        </button>

        <div className="hidden sm:block">

          <p className="text-xs font-semibold tracking-wide text-slate-400">
            ADMINISTRATION
          </p>

          <h2 className="text-lg font-bold text-slate-900">
            Hospital Management
          </h2>

        </div>
      </div>

      {/* ========================================
          RIGHT
      ======================================== */}

      <div className="flex items-center gap-2 sm:gap-4">

        {/* Notification */}

        <button
          type="button"
          className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="h-8 w-px bg-slate-200" />

        {/* ========================================
            PROFILE
        ======================================== */}

        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setShowMenu((prev) => !prev)
            }
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
          >

            {/* Avatar */}

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <ShieldCheck size={20} />
            </div>

            {/* Name / Email */}

            <div className="hidden text-left md:block">

              <p className="max-w-[180px] truncate text-sm font-semibold text-slate-800">
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                    Loading...
                  </span>
                ) : (
                  admin.name
                )}
              </p>

              <p className="max-w-[180px] truncate text-xs text-slate-400">
                {admin.email ||
                  "Hospital Administrator"}
              </p>

            </div>

            <ChevronDown
              size={17}
              className="hidden text-slate-400 md:block"
            />

          </button>

          {/* ========================================
              DROPDOWN
          ======================================== */}

          {showMenu && (
            <>
              {/* Overlay */}

              <div
                className="fixed inset-0 z-40"
                onClick={() =>
                  setShowMenu(false)
                }
              />

              {/* Menu */}

              <div className="absolute right-0 top-14 z-50 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">

                {/* Profile information */}

                <div className="mb-2 border-b border-slate-100 px-3 py-3">

                  <p className="text-sm font-semibold text-slate-900">
                    {admin.name}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-400">
                    {admin.email ||
                      "Administrator"}
                  </p>

                  <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-600">
                    {admin.role}
                  </span>

                </div>

                {/* Profile */}

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/admin/profile");
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <UserCircle
                    size={18}
                    className="text-slate-500"
                  />

                  My Profile
                </button>

                {/* Security */}

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    navigate(
                      "/admin/change-password"
                    );
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <LockKeyhole
                    size={18}
                    className="text-slate-500"
                  />

                  Change Password
                </button>

              </div>
            </>
          )}

        </div>
      </div>
    </header>
  );
}

export default AdminHeader;