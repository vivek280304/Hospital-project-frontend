import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HeartPulse,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Smartphone,
  ArrowLeft,
  UserRound,
} from "lucide-react";
import authService from "../../services/authService";

export default function ReceptionistLogin() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("password");
  const [step, setStep] = useState("email");

  const [form, setForm] = useState({
    email: "",
    password: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const getErrorMessage = (err, fallback) => {
    return (
      err?.response?.data?.message ||
      (typeof err?.response?.data === "string"
        ? err.response.data
        : "") ||
      err?.message ||
      fallback
    );
  };

  const validateReceptionist = (response) => {
    const role = String(response?.role || "").toUpperCase();

    if (role !== "RECEPTIONIST") {
      setError("This account is not a receptionist account.");
      return false;
    }

    localStorage.setItem("userRole", "RECEPTIONIST");

    return true;
  };

  // ---------------- PASSWORD LOGIN ----------------

  const handlePasswordLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await authService.login({
        email: form.email.trim(),
        password: form.password,
      });

      if (!validateReceptionist(response)) {
        return;
      }

      navigate("/receptionist/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error("Receptionist login error:", err);

      setError(
        getErrorMessage(err, "Invalid email or password.")
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- OTP LOGIN ----------------

  const handleRequestOtp = async () => {
    setError("");
    setSuccess("");

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      await authService.requestOtp({
        email: form.email.trim(),
      });

      setStep("otp");
      setSuccess("OTP sent successfully. Please check your email.");
    } catch (err) {
      console.error("OTP request error:", err);

      setError(
        getErrorMessage(
          err,
          "Unable to send OTP. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setSuccess("");

    if (!form.email.trim() || !form.otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await authService.verifyOtp({
        email: form.email.trim(),
        otp: form.otp.trim(),
      });

      if (!validateReceptionist(response)) {
        return;
      }

      navigate("/receptionist/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error("OTP verification error:", err);

      setError(
        getErrorMessage(
          err,
          "Invalid or expired OTP."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FORGOT PASSWORD ----------------

  const handleForgotPassword = async () => {
    setError("");
    setSuccess("");

    if (!form.email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    try {
      setLoading(true);

      await authService.forgotPassword({
        email: form.email.trim(),
      });

      setStep("reset");

      setSuccess(
        "Password reset OTP sent successfully."
      );
    } catch (err) {
      console.error("Forgot password error:", err);

      setError(
        getErrorMessage(
          err,
          "Unable to send reset OTP."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RESET PASSWORD ----------------

  const handleResetPassword = async () => {
    setError("");
    setSuccess("");

    if (!form.otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    if (!form.newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (form.newPassword.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await authService.resetPassword({
        email: form.email.trim(),
        otp: form.otp.trim(),
        newPassword: form.newPassword,
      });

      setSuccess(
        "Password reset successfully. You can now login."
      );

      setMode("password");
      setStep("email");

      setForm((prev) => ({
        ...prev,
        password: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      console.error("Reset password error:", err);

      setError(
        getErrorMessage(
          err,
          "Unable to reset password."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI HELPERS ----------------

  const switchMode = (newMode) => {
    setMode(newMode);
    setStep("email");
    setError("");
    setSuccess("");

    setForm((prev) => ({
      ...prev,
      password: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  const backToLogin = () => {
    setMode("password");
    setStep("email");
    setError("");
    setSuccess("");

    setForm((prev) => ({
      ...prev,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-6xl">

        <div className="bg-white rounded-[28px] shadow-2xl border border-slate-200 overflow-hidden">

          <div className="grid lg:grid-cols-2">

            {/* ================= LEFT BRAND SECTION ================= */}

            <div className="hidden lg:flex relative bg-[#10264a] text-white p-12 flex-col justify-between overflow-hidden">

              {/* Decorative circles */}
              <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-500/20" />
              <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-blue-400/10" />

              <div className="relative z-10">

                <div className="flex items-center gap-3 mb-10">

                  <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg">
                    <HeartPulse size={27} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      MediCare
                    </h2>

                    <p className="text-blue-200 text-xs">
                      Hospital Management System
                    </p>
                  </div>

                </div>

                <div className="max-w-md">

                  <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm text-blue-100 mb-6">
                    <ShieldCheck size={17} />
                    Secure Staff Portal
                  </div>

                  <h1 className="text-4xl font-bold leading-tight mb-5">
                    Receptionist
                    <span className="block text-blue-400">
                      Management Portal
                    </span>
                  </h1>

                  <p className="text-slate-300 leading-7">
                    Manage patients, appointments, doctor schedules
                    and hospital front-desk operations from one secure
                    platform.
                  </p>

                </div>

                <div className="mt-10 space-y-4">

                  <Feature
                    icon={<UserRound size={18} />}
                    title="Patient Management"
                    text="Search and manage patient records"
                  />

                  <Feature
                    icon={<Smartphone size={18} />}
                    title="Appointment Management"
                    text="Book and manage doctor appointments"
                  />

                  <Feature
                    icon={<ShieldCheck size={18} />}
                    title="Secure Access"
                    text="Protected receptionist account"
                  />

                </div>

              </div>

              <div className="relative z-10 text-sm text-slate-400">
                © {new Date().getFullYear()} MediCare Hospital
              </div>

            </div>

            {/* ================= RIGHT LOGIN SECTION ================= */}

            <div className="p-6 sm:p-10 lg:p-12">

              {/* Mobile Logo */}

              <div className="lg:hidden flex justify-center mb-6">

                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
                  <HeartPulse
                    className="text-white"
                    size={34}
                  />
                </div>

              </div>

              {/* Header */}

              <div className="text-center mb-7">

                <div className="hidden lg:flex justify-center mb-5">

                  <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md">
                    <HeartPulse
                      className="text-white"
                      size={28}
                    />
                  </div>

                </div>

                <h2 className="text-3xl font-bold text-[#10264a]">
                  {mode === "forgot"
                    ? "Reset Password"
                    : "Welcome Back"}
                </h2>

                <p className="text-slate-500 mt-2">

                  {mode === "forgot"
                    ? "Recover your receptionist account"
                    : "Sign in to your receptionist account"}

                </p>

              </div>

              {/* ================= MODE TABS ================= */}

              {mode !== "forgot" && (

                <div className="flex bg-slate-100 rounded-xl p-1 mb-6">

                  <button
                    type="button"
                    onClick={() => switchMode("password")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                      mode === "password"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Password Login
                  </button>

                  <button
                    type="button"
                    onClick={() => switchMode("otp")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                      mode === "otp"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    OTP Login
                  </button>

                </div>

              )}

              {/* ================= ALERTS ================= */}

              {error && (

                <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>

              )}

              {success && (

                <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
                  {success}
                </div>

              )}

              {/* ================= PASSWORD LOGIN ================= */}

              {mode === "password" && (

                <form
                  onSubmit={handlePasswordLogin}
                  className="space-y-5"
                >

                  <EmailInput
                    value={form.email}
                    onChange={handleChange}
                  />

                  <PasswordInput
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    show={showPassword}
                    setShow={setShowPassword}
                    placeholder="Enter your password"
                  />

                  <div className="flex justify-end">

                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setStep("email");
                        setError("");
                        setSuccess("");
                      }}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Forgot Password?
                    </button>

                  </div>

                  <SubmitButton
                    loading={loading}
                    text="Sign In"
                  />

                </form>

              )}

              {/* ================= OTP LOGIN ================= */}

              {mode === "otp" && (

                <div className="space-y-5">

                  <EmailInput
                    value={form.email}
                    onChange={handleChange}
                  />

                  {step === "email" ? (

                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60"
                    >
                      {loading
                        ? "Sending OTP..."
                        : "Send OTP"}

                      {!loading && (
                        <ArrowRight size={19} />
                      )}
                    </button>

                  ) : (

                    <>
                      <OtpInput
                        value={form.otp}
                        onChange={handleChange}
                      />

                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60"
                      >
                        {loading
                          ? "Verifying..."
                          : "Verify OTP"}

                        {!loading && (
                          <ShieldCheck size={19} />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        disabled={loading}
                        className="w-full text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Resend OTP
                      </button>
                    </>

                  )}

                </div>

              )}

              {/* ================= FORGOT PASSWORD ================= */}

              {mode === "forgot" && (

                <div className="space-y-5">

                  {step === "email" && (

                    <>
                      <EmailInput
                        value={form.email}
                        onChange={handleChange}
                      />

                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60"
                      >
                        {loading
                          ? "Sending OTP..."
                          : "Send Reset OTP"}

                        {!loading && (
                          <ArrowRight size={19} />
                        )}
                      </button>
                    </>

                  )}

                  {step === "reset" && (

                    <>

                      <OtpInput
                        value={form.otp}
                        onChange={handleChange}
                      />

                      <PasswordInput
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        show={showNewPassword}
                        setShow={setShowNewPassword}
                        placeholder="Enter new password"
                      />

                      <PasswordInput
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        show={showConfirmPassword}
                        setShow={setShowConfirmPassword}
                        placeholder="Confirm new password"
                      />

                      <button
                        type="button"
                        onClick={handleResetPassword}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60"
                      >
                        {loading
                          ? "Resetting..."
                          : "Reset Password"}

                        {!loading && (
                          <KeyRound size={19} />
                        )}
                      </button>

                    </>

                  )}

                  <button
                    type="button"
                    onClick={backToLogin}
                    className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"
                  >
                    <ArrowLeft size={16} />
                    Back to Login
                  </button>

                </div>

              )}

              {/* Security text */}

              <div className="mt-8 pt-6 border-t border-slate-100">

                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">

                  <ShieldCheck size={15} />

                  <span>
                    Your account information is protected
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function Feature({ icon, title, text }) {
  return (
    <div className="flex items-center gap-4">

      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-300">
        {icon}
      </div>

      <div>
        <p className="font-semibold text-white">
          {title}
        </p>

        <p className="text-sm text-slate-400">
          {text}
        </p>
      </div>

    </div>
  );
}

function EmailInput({ value, onChange }) {
  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Email Address
      </label>

      <div className="relative">

        <Mail
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="email"
          name="email"
          value={value}
          onChange={onChange}
          placeholder="receptionist@example.com"
          autoComplete="email"
          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />

      </div>

    </div>
  );
}

function PasswordInput({
  name,
  value,
  onChange,
  show,
  setShow,
  placeholder,
}) {
  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {name === "password"
          ? "Password"
          : name === "newPassword"
          ? "New Password"
          : "Confirm Password"}
      </label>

      <div className="relative">

        <Lock
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={
            name === "password"
              ? "current-password"
              : "new-password"
          }
          className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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

function OtpInput({ value, onChange }) {
  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        One-Time Password
      </label>

      <div className="relative">

        <KeyRound
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          name="otp"
          value={value}
          onChange={onChange}
          placeholder="Enter OTP"
          inputMode="numeric"
          maxLength={6}
          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition tracking-[0.3em] font-semibold"
        />

      </div>

    </div>
  );
}

function SubmitButton({ loading, text }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
    >
      {loading ? "Signing in..." : text}

      {!loading && <ArrowRight size={19} />}
    </button>
  );
}