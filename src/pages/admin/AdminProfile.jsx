import { useEffect, useState } from "react";
import {
  UserCircle,
  Mail,
  ShieldCheck,
  KeyRound,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function AdminProfile() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);
        setEmail(user.email || "");
      }
    } catch (error) {
      console.error("Failed to load admin profile:", error);
    }
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Admin Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your administrator account information.
        </p>
      </div>

      {/* Profile Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Top */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-8 sm:px-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/30">
              <UserCircle size={48} />
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white">
                Hospital Administrator
              </h2>

              <div className="mt-2 flex items-center justify-center gap-2 text-sm text-blue-100 sm:justify-start">
                <ShieldCheck size={16} />
                Administrator
              </div>
            </div>
          </div>
        </div>

        {/* Information */}
        <div className="p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-slate-900">
            Account Information
          </h3>

          <div className="mt-5 space-y-4">
            {/* Email */}
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Mail size={20} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email Address
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                  {email || "Administrator account"}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <ShieldCheck size={20} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Account Role
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  ADMIN
                </p>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <KeyRound size={19} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Password & Security
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">
                    Change your administrator account password.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/change-password")
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Change Password
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;