import { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  CalendarDays,
  ShieldCheck,
  ArrowRight,
  Stethoscope,
  UserRound,
  ClipboardList,
  UserCog,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import adminService from "../../services/adminService";

function AdminDashboard() {
  const navigate = useNavigate();

  const [roleCounts, setRoleCounts] = useState({
    doctors: 0,
    nurses: 0,
    receptionists: 0,
    labTechnicians: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await adminService.getRoleCounts();

        console.log("ADMIN ROLE COUNTS:", data);

        setRoleCounts({
          doctors: data?.doctors ?? 0,
          nurses: data?.nurses ?? 0,
          receptionists: data?.receptionists ?? 0,
          labTechnicians: data?.labTechnicians ?? 0,
        });
      } catch (err) {
        console.error(
          "ADMIN DASHBOARD ERROR:",
          err
        );

        setError(
          err.response?.data?.message ||
            err.response?.data ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // ==========================================
  // STAT CARDS
  // ==========================================

  const stats = [
    {
      title: "Doctors",
      value: roleCounts.doctors,
      description: "Registered doctors",
      icon: Stethoscope,
    },
    {
      title: "Nurses",
      value: roleCounts.nurses,
      description: "Registered nurses",
      icon: UserRound,
    },
    {
      title: "Receptionists",
      value: roleCounts.receptionists,
      description: "Registered receptionists",
      icon: UserCog,
    },
    {
      title: "Lab Technicians",
      value: roleCounts.labTechnicians,
      description: "Registered lab staff",
      icon: ClipboardList,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-7">

      {/* ========================================
          PAGE HEADER
      ========================================= */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Admin Dashboard
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Good Morning, Admin
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Hospital management overview and system activity.
          </p>
        </div>

        {/* System Status */}
        <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
            <span className="text-lg text-emerald-500">
              〽
            </span>
          </div>

          <div>
            <p className="text-xs text-slate-400">
              System Status
            </p>

            <p className="text-sm font-semibold text-slate-800">
              Operational
            </p>
          </div>
        </div>
      </div>

      {/* ========================================
          ERROR
      ========================================= */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-semibold">
              Dashboard data could not be loaded
            </p>

            <p className="mt-1">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* ========================================
          STAFF STATISTICS
      ========================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <div className="mt-3 text-3xl font-bold text-slate-900">
                    {loading ? (
                      <Loader2
                        size={27}
                        className="animate-spin text-blue-600"
                      />
                    ) : (
                      stat.value
                    )}
                  </div>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={23} />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* ========================================
          MANAGEMENT CARDS
      ========================================= */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* USER MANAGEMENT */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users size={23} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                User Management
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage hospital staff accounts and account access.
              </p>
            </div>

          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                <Users size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Staff Accounts
                </p>

                <p className="text-xs text-slate-400">
                  Search, lock or unlock staff accounts.
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/users")
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Manage Users
              <ArrowRight size={17} />
            </button>

          </div>
        </div>

        {/* CREATE USER */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <UserPlus size={23} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Create Staff Account
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add doctors, nurses, receptionists and lab technicians.
              </p>
            </div>

          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
                <UserPlus size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  New Staff Member
                </p>

                <p className="text-xs text-slate-400">
                  Create a new hospital staff account.
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/users/create")
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Create User
              <ArrowRight size={17} />
            </button>

          </div>
        </div>
      </div>

      {/* ========================================
          SCHEDULE + SECURITY
      ========================================= */}

      <div className="grid gap-6 lg:grid-cols-5">

        {/* DOCTOR SCHEDULE */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <CalendarDays size={23} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Doctor Schedules
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Configure doctor working days and appointment slots.
              </p>
            </div>

          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
            ].map((day) => (
              <div
                key={day}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center"
              >
                <p className="text-xs font-semibold text-slate-500">
                  {day}
                </p>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  —
                </p>

                <p className="text-[11px] text-slate-400">
                  doctors
                </p>
              </div>
            ))}

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/schedules")
            }
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            Manage Doctor Schedules
            <ArrowRight size={17} />
          </button>

        </div>

        {/* ACCOUNT SECURITY */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <ShieldCheck size={23} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Account Security
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage staff account access.
              </p>
            </div>

          </div>

          <div className="mt-6 space-y-3">

            <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-4">

              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                <span className="text-sm font-medium text-slate-700">
                  Registered Staff
                </span>
              </div>

              <span className="font-bold text-slate-800">
                {loading
                  ? "—"
                  : roleCounts.doctors +
                    roleCounts.nurses +
                    roleCounts.receptionists +
                    roleCounts.labTechnicians}
              </span>

            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/users")
            }
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            Manage Accounts
            <ArrowRight size={17} />
          </button>

        </div>
      </div>

      {/* ========================================
          QUICK ACTIONS
      ========================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Quick Actions
            </h2>

            <p className="text-sm text-slate-500">
              Common administrator actions.
            </p>
          </div>

        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">

          <button
            type="button"
            onClick={() =>
              navigate("/admin/users/create")
            }
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
          >
            <UserPlus
              size={19}
              className="text-blue-600"
            />

            <span className="text-sm font-semibold text-slate-700">
              Create User
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/users")
            }
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
          >
            <Users
              size={19}
              className="text-blue-600"
            />

            <span className="text-sm font-semibold text-slate-700">
              Find User
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/schedules")
            }
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
          >
            <CalendarDays
              size={19}
              className="text-blue-600"
            />

            <span className="text-sm font-semibold text-slate-700">
              Add Schedule
            </span>
          </button>

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;