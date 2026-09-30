import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UserSearch,
  UserPlus,
  ShieldCheck,
  UserCircle,
  KeyRound,
  LogOut,
  Stethoscope,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { getRefreshToken, clearTokens } from "../../utils/tokenUtils";

function AdminSidebar({ mobileOpen = false, onClose }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearTokens();
      navigate("/admin/login", { replace: true });
    }
  };

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      label: "Schedules",
      path: "/admin/schedules",
      icon: CalendarDays,
    },
   
    {
      label: "Create User",
      path: "/admin/users/create",
      icon: UserPlus,
    },
    {
      label: "Accounts",
      path: "/admin/accounts",
      icon: ShieldCheck,
    },
  ];

  const bottomItems = [
    {
      label: "Profile",
      path: "/admin/profile",
      icon: UserCircle,
    },
    {
      label: "Change Password",
      path: "/admin/change-password",
      icon: KeyRound,
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#0f172a] text-white">
      {/* Logo */}
      <div className="flex h-20 items-center justify-between border-b border-slate-700/60 px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <Stethoscope size={22} />
          </div>

          <div>
            <h1 className="text-lg font-bold">MediCare</h1>
            <p className="text-[11px] text-slate-400">
              Hospital Management
            </p>
          </div>
        </div>

        {/* Mobile close */}
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* Admin badge */}
      <div className="mx-4 mt-5 rounded-xl bg-blue-600/10 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
            <ShieldCheck size={18} />
          </div>

          <div>
            <p className="text-xs font-semibold text-blue-300">
              ADMIN PORTAL
            </p>
            <p className="text-[11px] text-slate-400">
              System Administrator
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Management
        </p>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <p className="mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Account
        </p>

        <nav className="space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="border-t border-slate-700/60 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

export default AdminSidebar;