import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";

import authService from "../../services/authService";

export default function ReceptionistChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const passwordChecks = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };

  const strength = Object.values(passwordChecks).filter(Boolean).length;

  const getStrengthLabel = () => {
    if (!newPassword) return "";
    if (strength <= 2) return "Weak";
    if (strength === 3) return "Fair";
    if (strength === 4) return "Good";
    return "Strong";
  };

  const getStrengthWidth = () => {
    if (!newPassword) return "0%";
    return `${(strength / 5) * 100}%`;
  };

  const isValidPassword =
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.lowercase &&
    passwordChecks.number &&
    passwordChecks.special;

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (!isValidPassword) {
      setError(
        "Please make sure your new password meets all the requirements."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
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

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSuccess("Your password has been changed successfully.");
    } catch (err) {
      console.error("Change password error:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Unable to change password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f9fd] text-[#10264a]">

      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-5 py-4 lg:px-8">

          <button
            type="button"
            onClick={() => navigate("/receptionist/dashboard")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-xl font-bold text-[#10264a]">
              Change Password
            </h1>

            <p className="text-xs text-slate-500">
              Update your account security settings
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-5 py-8 lg:px-8">

        {/* PAGE INTRO */}
        <div className="mb-7">
          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <ShieldCheck size={26} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Account Security
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Keep your MediCare account protected with a strong password.
              </p>
            </div>

          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

          {/* PASSWORD FORM */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <KeyRound size={21} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-800">
                    Change your password
                  </h3>

                  <p className="text-xs text-slate-500">
                    Enter your current password and choose a new one.
                  </p>
                </div>

              </div>
            </div>

            <form
              onSubmit={submit}
              className="space-y-5 p-6"
            >

              {/* ERROR */}
              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle
                    size={19}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{error}</span>
                </div>
              )}

              {/* SUCCESS */}
              {success && (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{success}</span>
                </div>
              )}

              {/* CURRENT PASSWORD */}
              <PasswordInput
                label="Current Password"
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={setCurrentPassword}
                visible={showCurrent}
                setVisible={setShowCurrent}
                icon={<LockKeyhole size={18} />}
              />

              {/* NEW PASSWORD */}
              <div>
                <PasswordInput
                  label="New Password"
                  placeholder="Create a new password"
                  value={newPassword}
                  onChange={setNewPassword}
                  visible={showNew}
                  setVisible={setShowNew}
                  icon={<KeyRound size={18} />}
                />

                {/* STRENGTH */}
                {newPassword && (
                  <div className="mt-3">

                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">
                        Password strength
                      </span>

                      <span
                        className={`text-xs font-bold ${
                          strength <= 2
                            ? "text-red-500"
                            : strength === 3
                            ? "text-orange-500"
                            : strength === 4
                            ? "text-blue-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {getStrengthLabel()}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all ${
                          strength <= 2
                            ? "bg-red-500"
                            : strength === 3
                            ? "bg-orange-500"
                            : strength === 4
                            ? "bg-blue-600"
                            : "bg-emerald-500"
                        }`}
                        style={{
                          width: getStrengthWidth(),
                        }}
                      />
                    </div>

                  </div>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <PasswordInput
                label="Confirm New Password"
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                visible={showConfirm}
                setVisible={setShowConfirm}
                icon={<KeyRound size={18} />}
              />

              {/* MATCH STATUS */}
              {confirmPassword && (
                <div
                  className={`flex items-center gap-2 text-xs font-medium ${
                    newPassword === confirmPassword
                      ? "text-emerald-600"
                      : "text-red-500"
                  }`}
                >
                  {newPassword === confirmPassword ? (
                    <>
                      <Check size={15} />
                      Passwords match
                    </>
                  ) : (
                    <>
                      <X size={15} />
                      Passwords do not match
                    </>
                  )}
                </div>
              )}

              {/* BUTTONS */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    navigate("/receptionist/dashboard")
                  }
                  disabled={loading}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={17} />
                      Change Password
                    </>
                  )}
                </button>

              </div>

            </form>
          </section>

          {/* SECURITY INFO */}
          <aside className="space-y-5">

            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6">

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                <ShieldCheck size={25} />
              </div>

              <h3 className="text-lg font-bold text-slate-800">
                Password Security
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                A strong password helps protect patient information and
                your MediCare account.
              </p>

              <div className="mt-5 space-y-3">

                <Requirement
                  checked={passwordChecks.length}
                  text="At least 8 characters"
                />

                <Requirement
                  checked={passwordChecks.uppercase}
                  text="One uppercase letter"
                />

                <Requirement
                  checked={passwordChecks.lowercase}
                  text="One lowercase letter"
                />

                <Requirement
                  checked={passwordChecks.number}
                  text="One number"
                />

                <Requirement
                  checked={passwordChecks.special}
                  text="One special character"
                />

              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Security Tip
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Never share your MediCare password with anyone.
                    Avoid using passwords that you use on other websites.
                  </p>
                </div>

              </div>

            </div>

          </aside>

        </div>
      </main>
    </div>
  );
}


/* =====================================================
   PASSWORD INPUT
===================================================== */

function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
  visible,
  setVisible,
  icon,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">

        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
        />

        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          {visible ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>

      </div>
    </div>
  );
}


/* =====================================================
   REQUIREMENT
===================================================== */

function Requirement({ checked, text }) {
  return (
    <div className="flex items-center gap-2.5">

      <div
        className={`flex h-5 w-5 items-center justify-center rounded-full ${
          checked
            ? "bg-emerald-100 text-emerald-600"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        <Check size={12} strokeWidth={3} />
      </div>

      <span
        className={`text-xs ${
          checked
            ? "font-medium text-emerald-700"
            : "text-slate-500"
        }`}
      >
        {text}
      </span>

    </div>
  );
}