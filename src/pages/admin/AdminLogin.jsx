import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Stethoscope,
  KeyRound,
  ArrowLeft,
} from "lucide-react";

import authService from "../../services/authService";

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState("password");
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  // -----------------------------
  // PASSWORD LOGIN
  // -----------------------------
  const handlePasswordLogin = async (e) => {
    e.preventDefault();

    clearMessages();

    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await authService.login({
        email: email.trim(),
        password,
      });

      if (response.role?.toUpperCase() !== "ADMIN") {
        setError("This account does not have admin access.");
        return;
      }

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("Admin login error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // REQUEST OTP
  // -----------------------------
  const handleRequestOtp = async (e) => {
    e.preventDefault();

    clearMessages();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      await authService.requestOtp({
        email: email.trim(),
      });

      setMessage("OTP has been sent to your email.");
      setMode("otp");
    } catch (err) {
      console.error("OTP request error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // VERIFY OTP
  // -----------------------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    clearMessages();

    if (!email.trim() || !otp.trim()) {
      setError("Please enter your email and OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await authService.verifyOtp({
        email: email.trim(),
        otp: otp.trim(),
      });

      if (response.role?.toUpperCase() !== "ADMIN") {
        setError("This account does not have admin access.");
        return;
      }

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("OTP verification error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // FORGOT PASSWORD
  // -----------------------------
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    clearMessages();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      await authService.forgotPassword({
        email: email.trim(),
      });

      setMessage("Password reset OTP has been sent to your email.");
      setMode("reset");
    } catch (err) {
      console.error("Forgot password error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to send reset OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // RESET PASSWORD
  // -----------------------------
  const handleResetPassword = async (e) => {
    e.preventDefault();

    clearMessages();

    if (!email.trim() || !otp.trim() || !newPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await authService.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });

      setMessage("Password reset successfully. You can now login.");

      setPassword("");
      setOtp("");
      setNewPassword("");

      setMode("password");
    } catch (err) {
      console.error("Reset password error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    clearMessages();
    setOtp("");
    setNewPassword("");
    setMode("password");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* LEFT BRANDING SECTION */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                <Stethoscope size={27} />
              </div>

              <div>
                <h1 className="text-2xl font-bold">MediCare</h1>
                <p className="text-xs text-blue-200">
                  Hospital Management System
                </p>
              </div>
            </div>

            {/* Main text */}
            <div className="mt-24 max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-blue-100">
                <ShieldCheck size={17} />
                Secure Administration
              </div>

              <h2 className="text-5xl font-bold leading-tight">
                Manage your hospital
                <span className="block text-blue-200">
                  from one place.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-lg leading-8 text-blue-100">
                Manage hospital staff, doctor schedules, accounts and
                administrative operations securely with MediCare.
              </p>
            </div>
          </div>

          <div className="text-sm text-blue-200">
            © {new Date().getFullYear()} MediCare Hospital Management System
          </div>
        </div>
      </div>

      {/* RIGHT LOGIN SECTION */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Stethoscope size={24} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">MediCare</h1>
              <p className="text-xs text-slate-500">
                Hospital Management
              </p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <ShieldCheck size={30} />
            </div>

            <h2 className="text-3xl font-bold text-slate-900">
              Admin Portal
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to manage your hospital system.
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {/* PASSWORD LOGIN */}
          {mode === "password" && (
            <form onSubmit={handlePasswordLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Admin Email
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
                      clearMessages();
                    }}
                    placeholder="admin@hospital.com"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      clearMessages();
                      setMode("forgot");
                    }}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearMessages();
                    }}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign in to Admin Portal
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* OTP */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>

                <div className="relative flex justify-center">
                  <span className="bg-slate-50 px-3 text-xs text-slate-400">
                    OR
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setMode("otp");
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
              >
                <KeyRound size={18} />
                Login with OTP
              </button>
            </form>
          )}

          {/* OTP LOGIN */}
          {mode === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <button
                type="button"
                onClick={goBack}
                className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
              >
                <ArrowLeft size={17} />
                Back to login
              </button>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Admin Email
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@hospital.com"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={loading}
                className="w-full rounded-xl border border-blue-200 bg-blue-50 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Enter OTP
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter 6-digit OTP"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-center text-lg tracking-[0.4em] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD */}
          {mode === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <button
                type="button"
                onClick={goBack}
                className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
              >
                <ArrowLeft size={17} />
                Back to login
              </button>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Admin Email
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@hospital.com"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : "Send Reset OTP"}
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* RESET PASSWORD */}
          {mode === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <button
                type="button"
                onClick={goBack}
                className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
              >
                <ArrowLeft size={17} />
                Back to login
              </button>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  OTP
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter OTP"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-center tracking-[0.4em] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  New Password
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Resetting..." : "Reset Password"}
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-xs text-slate-400">
            Authorized hospital administrators only
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;