import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import authService from "../../services/authService";

function DoctorChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccess("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "New password and confirm password do not match."
      );
      return;
    }

    if (currentPassword === newPassword) {
      setError(
        "New password must be different from your current password."
      );
      return;
    }

    try {
      setLoading(true);

      await authService.changePassword({
        currentPassword,
        newPassword,
      });

      setSuccess(
        "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(
        "Change password error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Unable to change password. Please check your current password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-5">

          <button
            type="button"
            onClick={() =>
              navigate("/doctor/dashboard")
            }
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Change Password
            </h1>

            <p className="text-sm text-slate-500">
              Update your doctor portal password
            </p>
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">

        <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

          {/* Icon */}
          <div className="mb-6 flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <LockKeyhole size={28} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Secure your account
              </h2>

              <p className="text-sm text-slate-500">
                Enter your current password and choose
                a new password.
              </p>
            </div>

          </div>

          {/* Success */}
          {success && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">

              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0"
              />

              <p className="text-sm font-medium">
                {success}
              </p>

            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0"
              />

              <p className="text-sm font-medium">
                {error}
              </p>

            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Current Password */}
            <PasswordInput
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
              show={showCurrent}
              setShow={setShowCurrent}
              placeholder="Enter current password"
            />

            {/* New Password */}
            <PasswordInput
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              show={showNew}
              setShow={setShowNew}
              placeholder="Enter new password"
            />

            {/* Confirm Password */}
            <PasswordInput
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirm}
              setShow={setShowConfirm}
              placeholder="Confirm new password"
            />

            {/* Password requirements */}
            <div className="rounded-xl bg-slate-50 p-4">

              <p className="mb-2 text-sm font-semibold text-slate-700">
                Password requirements
              </p>

              <ul className="space-y-1 text-xs text-slate-500">
                <li>• At least 6 characters</li>
                <li>• New password must differ from current password</li>
                <li>• Confirm password must match</li>
              </ul>

            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">

              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Changing Password..."
                  : "Change Password"}
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/doctor/dashboard")
                }
                disabled={loading}
                className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  show,
  setShow,
  placeholder,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          required
        />

        <button
          type="button"
          onClick={() =>
            setShow(!show)
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          {show ? (
            <EyeOff size={19} />
          ) : (
            <Eye size={19} />
          )}
        </button>

      </div>

    </div>
  );
}

export default DoctorChangePassword;