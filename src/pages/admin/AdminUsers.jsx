import { useState } from "react";
import {
  Search,
  Mail,
  Lock,
  Unlock,
  UserRound,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import adminService from "../../services/adminService";

function AdminUsers() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const searchUser = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setUser(null);

    if (!email.trim()) {
      setError("Please enter an email address.");
      return;
    }

    try {
      setLoading(true);

      const data =
        await adminService.findUserByEmail(
          email.trim()
        );

      console.log("USER SEARCH RESPONSE:", data);

      let result = data;

      if (Array.isArray(data)) {
        result = data[0] || null;
      } else if (data?.user) {
        result = data.user;
      } else if (data?.data) {
        result = data.data;
      }

      if (!result) {
        setError("User not found.");
        return;
      }

      setUser(result);
    } catch (err) {
      console.error("SEARCH USER ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "User not found."
      );
    } finally {
      setLoading(false);
    }
  };

  const isLocked =
    user?.locked === true ||
    user?.accountNonLocked === false;

  const handleLock = async () => {
    if (!user?.id) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await adminService.lockUser(user.id);

      setUser((prev) => ({
        ...prev,
        locked: true,
        accountNonLocked: false,
      }));

      setSuccess("User account has been locked.");
    } catch (err) {
      console.error("LOCK USER ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to lock account."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnlock = async () => {
    if (!user?.id) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await adminService.unlockUser(user.id);

      setUser((prev) => ({
        ...prev,
        locked: false,
        accountNonLocked: true,
      }));

      setSuccess("User account has been unlocked.");
    } catch (err) {
      console.error("UNLOCK USER ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to unlock account."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          User Management
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Search staff accounts and manage account security.
        </p>
      </div>

      {/* SEARCH */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <form
          onSubmit={searchUser}
          className="grid gap-4 md:grid-cols-[1fr_auto]"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Staff Email
            </label>

            <div className="relative">
              <Mail
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                  setSuccess("");
                }}
                placeholder="doctor@hospital.com"
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 md:w-auto"
            >
              {loading ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Search size={18} />
              )}

              {loading ? "Searching..." : "Search User"}
            </button>
          </div>
        </form>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={19} />
          <span>{error}</span>
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2 size={19} />
          <span>{success}</span>
        </div>
      )}

      {/* USER */}
      {user && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <UserRound size={26} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {user.name || "Unknown User"}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {user.email}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  isLocked
                    ? "bg-red-100 text-red-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-current" />
                {isLocked ? "Locked" : "Active"}
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
            <Info
              label="User ID"
              value={user.id ?? "—"}
            />

            <Info
              label="Email"
              value={user.email ?? "—"}
            />

            <Info
              label="Role"
              value={user.role ?? "—"}
            />
          </div>

          <div className="border-t border-slate-200 p-5 sm:p-6">
            {isLocked ? (
              <button
                type="button"
                onClick={handleUnlock}
                disabled={actionLoading}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {actionLoading ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Unlock size={18} />
                )}

                Unlock Account
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLock}
                disabled={actionLoading}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {actionLoading ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Lock size={18} />
                )}

                Lock Account
              </button>
            )}
          </div>
        </div>
      )}

      {/* EMPTY */}
      {!user && !loading && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <UserRound
            size={40}
            className="mx-auto text-slate-300"
          />

          <h3 className="mt-4 font-semibold text-slate-700">
            Search for a staff member
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Enter their email address above.
          </p>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

export default AdminUsers;