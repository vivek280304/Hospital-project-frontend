import { useEffect, useState } from "react";
import {
  Menu,
  Bell,
  ChevronDown,
  ShieldCheck,
  UserCircle,
  LockKeyhole,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function AdminHeader({ onMenuClick }) {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (user && typeof user === "object") {
        setAdminEmail(user.email || "");
      }
    } catch (error) {
      console.error(
        "Unable to parse stored user:",
        error
      );
    }
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={23} />
        </button>

        <div className="hidden sm:block">
          <p className="text-xs font-medium text-slate-400">
            ADMINISTRATION
          </p>

          <h2 className="text-lg font-bold text-slate-900">
            Hospital Management
          </h2>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"
        >
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="h-8 w-px bg-slate-200" />

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setShowMenu((prev) => !prev)
            }
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-slate-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <ShieldCheck size={20} />
            </div>

            <div className="hidden text-left md:block">
              <p className="text-sm font-semibold text-slate-800">
                Admin
              </p>

              <p className="max-w-[180px] truncate text-xs text-slate-400">
                {adminEmail || "Hospital Administrator"}
              </p>
            </div>

            <ChevronDown
              size={17}
              className="hidden text-slate-400 md:block"
            />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              />

              <div className="absolute right-0 top-14 z-50 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/admin/profile");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <UserCircle size={18} />
                  My Profile
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/admin/change-password");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <LockKeyhole size={18} />
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