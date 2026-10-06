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
  IndianRupee,
  X,
} from "lucide-react";

import adminService from "../../services/adminService";

const AdminUsers = () => {
  // ==============================
  // SEARCH
  // ==============================
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  // ==============================
  // LOADING
  // ==============================
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ==============================
  // MESSAGES
  // ==============================
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==============================
  // CHANGE FEE MODAL
  // ==============================
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [newFee, setNewFee] = useState("");

  // =========================================================
  // SEARCH USER
  // =========================================================
  const searchUser = async (e) => {
    e.preventDefault();

    const value = email.trim();

    if (!value) {
      setError("Please enter an email address.");
      setSuccess("");
      setUser(null);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setUser(null);

    try {
      const response = await adminService.findUserByEmail(value);

      console.log("User response:", response);

      // Handle different possible response structures
      const foundUser =
        response?.data ||
        response?.user ||
        response;

      if (!foundUser) {
        throw new Error("User not found.");
      }

      setUser(foundUser);

    } catch (err) {
      console.error("Search user error:", err);

      setError(
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "User not found."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // GET NORMALIZED ROLE
  // =========================================================
  const getRole = () => {
    if (!user) return "";

    let role =
      user.role ||
      user.roles?.[0] ||
      user.userRole ||
      user.authorities?.[0]?.authority ||
      "";

    if (typeof role === "object" && role !== null) {
      role =
        role.authority ||
        role.role ||
        "";
    }

    return String(role)
      .replace(/^ROLE_/i, "")
      .toUpperCase();
  };

  const role = getRole();

  const isDoctor = role === "DOCTOR";

  // =========================================================
  // LOCK / UNLOCK USER
  // =========================================================
  const handleLockUnlock = async () => {
    if (!user) return;

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      if (user.accountNonLocked === false) {
        // Unlock
        await adminService.unlockUser(user.id);

        setUser((prev) => ({
          ...prev,
          accountNonLocked: true,
        }));

        setSuccess("User unlocked successfully.");

      } else {
        // Lock
        await adminService.lockUser(user.id);

        setUser((prev) => ({
          ...prev,
          accountNonLocked: false,
        }));

        setSuccess("User locked successfully.");
      }

    } catch (err) {
      console.error("Lock/unlock error:", err);

      setError(
        err?.response?.data?.message ||
        err?.response?.data ||
        "Unable to update user status."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // OPEN CHANGE FEE MODAL
  // =========================================================
  const openFeeModal = () => {
    setNewFee("");
    setError("");
    setSuccess("");
    setShowFeeModal(true);
  };

  // =========================================================
  // CHANGE DOCTOR FEE
  // =========================================================
  const handleChangeFee = async () => {
  const amount = Number(newFee);

  if (!newFee.trim()) {
    setError("Please enter the new consultation fee.");
    return;
  }

  if (!Number.isFinite(amount) || amount < 0) {
    setError("Please enter a valid consultation fee.");
    return;
  }

  if (!user?.email) {
    setError("User email is missing.");
    return;
  }

  setActionLoading(true);
  setError("");
  setSuccess("");

  try {
    await adminService.changeDoctorFee({
      email: user.email,
      amount: amount,
    });

    setShowFeeModal(false);
    setNewFee("");

    setSuccess(
      "Doctor consultation fee updated successfully."
    );

  } catch (err) {
    console.error("Change fee error:", err);

    setError(
      err?.response?.data?.message ||
      err?.response?.data ||
      "Unable to change consultation fee."
    );
  } finally {
    setActionLoading(false);
  }
};

  // =========================================================
  // JSX
  // =========================================================
  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* ========================================= */}
      {/* PAGE HEADER */}
      {/* ========================================= */}

      <div className="mb-6">

        <h1 className="text-2xl font-bold text-slate-800">
          User Management
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Search and manage registered users
        </p>

      </div>

      {/* ========================================= */}
      {/* SEARCH CARD */}
      {/* ========================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <form onSubmit={searchUser}>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Search User
          </label>

          <div className="flex gap-3">

            {/* INPUT */}

            <div className="relative flex-1">

              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter user email..."
                className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* SEARCH BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Search size={18} />
              )}

              Search

            </button>

          </div>

        </form>

      </div>

      {/* ========================================= */}
      {/* ERROR MESSAGE */}
      {/* ========================================= */}

      {error && (
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

          <AlertCircle size={20} />

          <span>{error}</span>

        </div>
      )}

      {/* ========================================= */}
      {/* SUCCESS MESSAGE */}
      {/* ========================================= */}

      {success && (
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">

          <CheckCircle2 size={20} />

          <span>{success}</span>

        </div>
      )}

      {/* ========================================= */}
      {/* USER CARD */}
      {/* ========================================= */}

      {user && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* USER HEADER */}

          <div className="flex items-center justify-between border-b border-slate-200 p-6">

            <div className="flex items-center gap-4">

              {/* AVATAR */}

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">

                <UserRound size={28} />

              </div>

              {/* NAME */}

              <div>

                <h2 className="text-xl font-bold text-slate-800">

                  {user.name || "User"}

                </h2>

                <p className="text-sm text-slate-500">

                  User ID: {user.id}

                </p>

              </div>

            </div>

            {/* ROLE BADGE */}

            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">

              <ShieldCheck size={17} />

              {role || "ROLE NOT AVAILABLE"}

            </div>

          </div>

          {/* ========================================= */}
          {/* USER INFORMATION */}
          {/* ========================================= */}

          <div className="grid gap-4 p-6 md:grid-cols-3">

            {/* USER ID */}

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="mb-1 text-xs font-medium uppercase text-slate-400">
                User ID
              </p>

              <p className="font-semibold text-slate-800">
                {user.id || "-"}
              </p>

            </div>

            {/* EMAIL */}

            <div className="rounded-xl bg-slate-50 p-4">

              <div className="mb-1 flex items-center gap-2">

                <Mail
                  size={15}
                  className="text-slate-400"
                />

                <p className="text-xs font-medium uppercase text-slate-400">
                  Email
                </p>

              </div>

              <p className="break-all font-semibold text-slate-800">
                {user.email || "-"}
              </p>

            </div>

            {/* ROLE */}

            <div className="rounded-xl bg-slate-50 p-4">

              <div className="mb-1 flex items-center gap-2">

                <ShieldCheck
                  size={15}
                  className="text-slate-400"
                />

                <p className="text-xs font-medium uppercase text-slate-400">
                  Role
                </p>

              </div>

              <p className="font-semibold text-blue-600">

                {role || "Not available"}

              </p>

            </div>

          </div>

          {/* ========================================= */}
          {/* ACTION BUTTONS */}
          {/* ========================================= */}

          <div className="flex flex-wrap gap-3 border-t border-slate-200 p-6">

            {/* LOCK / UNLOCK */}

            <button
              type="button"
              onClick={handleLockUnlock}
              disabled={actionLoading}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                user.accountNonLocked === false
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >

              {actionLoading ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : user.accountNonLocked === false ? (
                <Unlock size={18} />
              ) : (
                <Lock size={18} />
              )}

              {user.accountNonLocked === false
                ? "Unlock User"
                : "Lock User"}

            </button>

            {/* ===================================== */}
            {/* CHANGE FEE - ONLY DOCTOR */}
            {/* ===================================== */}

            {isDoctor && (
              <button
                type="button"
                onClick={openFeeModal}
                disabled={actionLoading}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                <IndianRupee size={18} />

                Change Fee

              </button>
            )}

          </div>

        </div>
      )}

      {/* ========================================= */}
      {/* EMPTY STATE */}
      {/* ========================================= */}

      {!user && !loading && !error && (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

          <UserRound
            size={42}
            className="mx-auto mb-4 text-slate-300"
          />

          <h3 className="font-semibold text-slate-700">
            Search for a user
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Enter a user's email address to search.
          </p>

        </div>
      )}

      {/* ========================================= */}
      {/* CHANGE FEE MODAL */}
      {/* ========================================= */}

      {showFeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            {/* MODAL HEADER */}

            <div className="mb-6 flex items-start justify-between">

              <div>

                <h2 className="text-xl font-bold text-slate-800">
                  Change Consultation Fee
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the new consultation fee for this doctor.
                </p>

              </div>

              <button
                type="button"
                onClick={() => {
                  setShowFeeModal(false);
                  setNewFee("");
                  setError("");
                }}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >

                <X size={20} />

              </button>

            </div>

            {/* DOCTOR NAME */}

            <div className="mb-4 rounded-xl bg-slate-50 p-4">

              <p className="text-xs uppercase text-slate-400">
                Doctor
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {user?.name}
              </p>

            </div>

            {/* FEE INPUT */}

            <label className="mb-2 block text-sm font-medium text-slate-700">
              New Consultation Fee
            </label>

            <div className="relative">

              <IndianRupee
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="number"
                min="0"
                step="0.01"
                value={newFee}
                onChange={(e) => setNewFee(e.target.value)}
                placeholder="Enter new fee"
                autoFocus
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* MODAL BUTTONS */}

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={() => {
                  setShowFeeModal(false);
                  setNewFee("");
                  setError("");
                }}
                className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleChangeFee}
                disabled={actionLoading}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {actionLoading && (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                )}

                Update Fee

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminUsers;