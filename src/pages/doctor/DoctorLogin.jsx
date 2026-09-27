import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  Mail,
  Stethoscope,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import authService from "../../services/authService";

function DoctorLogin() {
  const navigate = useNavigate();

  const [loginMode, setLoginMode] = useState("password");
  const [step, setStep] = useState("email");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ================= PASSWORD LOGIN =================

  const handlePasswordLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await authService.login({
        email: email.trim(),
        password,
      });

      console.log("Doctor login response:", response);

      navigate("/doctor/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error("Doctor login error:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= REQUEST OTP =================

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await authService.requestOtp({
        email: email.trim(),
      });

      console.log("OTP request response:", response);

      setSuccess(
        response?.message ||
          "OTP has been sent to your email."
      );

      setStep("otp");
    } catch (err) {
      console.error("OTP request error:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Unable to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= VERIFY OTP =================

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    if (otp.trim().length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }

    try {
      setLoading(true);

      const response = await authService.verifyOtp({
        email: email.trim(),
        otp: otp.trim(),
      });

      console.log("Doctor OTP login response:", response);

      navigate("/doctor/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error("OTP verification error:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= SWITCH LOGIN MODE =================

  const switchMode = (mode) => {
    setLoginMode(mode);
    setStep("email");
    setError("");
    setSuccess("");
    setOtp("");
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= NAVBAR ================= */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            to="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <HeartPulse size={23} />
            </div>

            <span className="text-xl font-bold text-slate-800">
              Medi<span className="text-blue-600">Care</span>
            </span>
          </Link>

        
        </div>
      </header>

      {/* ================= LOGIN AREA ================= */}

      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">

          {/* ================= LEFT PANEL ================= */}

          <div className="hidden bg-gradient-to-br from-blue-700 to-cyan-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">

            <div>

              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <Stethoscope size={30} />
              </div>

              <h1 className="text-4xl font-bold leading-tight">
                Welcome,
                <br />
                Doctor
              </h1>

              <p className="mt-5 max-w-sm leading-7 text-blue-100">
                Access your MediCare doctor portal to manage
                appointments, patients, schedules and medical
                records.
              </p>

            </div>

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

              <div className="flex items-center gap-3">
                <ShieldCheck size={24} />

                <div>
                  <p className="font-semibold">
                    Secure Doctor Portal
                  </p>

                  <p className="text-sm text-blue-100">
                    Your medical data is protected.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* ================= RIGHT PANEL ================= */}

          <div className="p-7 sm:p-10">

            {/* Header */}

            <div className="mb-8">

              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 lg:hidden">
                <Stethoscope size={25} />
              </div>

              <h2 className="text-3xl font-bold text-slate-800">
                Doctor Login
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to access your doctor dashboard.
              </p>

            </div>

            {/* ================= LOGIN TABS ================= */}

            <div className="mb-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1">

              <button
                type="button"
                onClick={() => switchMode("password")}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  loginMode === "password"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Password
              </button>

              <button
                type="button"
                onClick={() => switchMode("otp")}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  loginMode === "otp"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Login with OTP
              </button>

            </div>

            {/* ================= ERROR ================= */}

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

                <AlertCircle
                  size={19}
                  className="mt-0.5 shrink-0"
                />

                <p>{error}</p>

              </div>
            )}

            {/* ================= SUCCESS ================= */}

            {success && (
              <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                {success}
              </div>
            )}

            {/* ================================================= */}
            {/* PASSWORD LOGIN */}
            {/* ================================================= */}

            {loginMode === "password" && (
              <form
                onSubmit={handlePasswordLogin}
                className="space-y-5"
              >

                {/* Email */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
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
                      placeholder="doctor@example.com"
                      className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />

                  </div>

                </div>

                {/* Password */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label className="text-sm font-semibold text-slate-700">
                      Password
                    </label>

                    <Link
                      to="/doctor/forgot-password"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Forgot Password?
                    </Link>

                  </div>

                  <div className="relative">

                    <LockKeyhole
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
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

                {/* Login */}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    <>
                      <Loader2
                        size={19}
                        className="animate-spin"
                      />
                      Signing in...
                    </>
                  ) : (
                    "Login"
                  )}

                </button>

              </form>
            )}

            {/* ================================================= */}
            {/* OTP LOGIN */}
            {/* ================================================= */}

            {loginMode === "otp" && (
              <>
                {/* STEP 1 - EMAIL */}

                {step === "email" && (
                  <form
                    onSubmit={handleRequestOtp}
                    className="space-y-5"
                  >

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Doctor Email
                      </label>

                      <div className="relative">

                        <Mail
                          size={19}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="email"
                          value={email}
                          onChange={(e) =>
                            setEmail(e.target.value)
                          }
                          placeholder="doctor@example.com"
                          className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                        />

                      </div>

                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      {loading ? (
                        <>
                          <Loader2
                            size={19}
                            className="animate-spin"
                          />
                          Sending OTP...
                        </>
                      ) : (
                        "Send OTP"
                      )}

                    </button>

                  </form>
                )}

                {/* STEP 2 - OTP */}

                {step === "otp" && (
                  <form
                    onSubmit={handleVerifyOtp}
                    className="space-y-5"
                  >

                    <div className="rounded-xl bg-blue-50 p-4">

                      <p className="text-sm text-slate-600">
                        OTP sent to
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {email}
                      </p>

                    </div>

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Enter OTP
                      </label>

                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(e) =>
                          setOtp(
                            e.target.value.replace(
                              /\D/g,
                              ""
                            )
                          )
                        }
                        placeholder="Enter 6-digit OTP"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-center text-lg font-semibold tracking-[0.5em] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                      />

                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      {loading ? (
                        <>
                          <Loader2
                            size={19}
                            className="animate-spin"
                          />
                          Verifying...
                        </>
                      ) : (
                        "Verify & Login"
                      )}

                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setStep("email");
                        setOtp("");
                        setError("");
                        setSuccess("");
                      }}
                      className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"
                    >
                      <ArrowLeft size={16} />
                      Change Email
                    </button>

                  </form>
                )}

              </>
            )}

            {/* Footer */}

            <div className="mt-8 border-t border-slate-100 pt-6 text-center">

              <p className="text-xs text-slate-400">
                Authorized medical staff only
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default DoctorLogin;