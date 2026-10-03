import { useState } from "react";
import {
  Eye,
  EyeOff,
  FlaskConical,
  LockKeyhole,
  Mail,
  Loader2,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import authService from "../../services/authService";
import { clearTokens } from "../../utils/tokenUtils";

export default function Login() {
  const navigate = useNavigate();

  // =========================
  // LOGIN MODE
  // =========================

  const [loginMode, setLoginMode] = useState("password");
  const [otpStep, setOtpStep] = useState("email");

  // =========================
  // FORM STATE
  // =========================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // NORMALIZE ROLE
  // =====================================================

  const normalizeRole = (role) => {
    if (Array.isArray(role)) {
      role = role[0];
    }

    if (typeof role === "object" && role !== null) {
      role =
        role.authority ||
        role.role ||
        null;
    }

    if (typeof role === "string") {
      return role
        .replace(/^ROLE_/i, "")
        .toUpperCase();
    }

    return null;
  };

  // =====================================================
  // GET ROLE FROM JWT
  // =====================================================

  const getRoleFromToken = (token) => {
    try {
      if (!token) return null;

      const payloadPart = token.split(".")[1];

      if (!payloadPart) return null;

      const normalizedPayload = payloadPart
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const payload = JSON.parse(
        decodeURIComponent(
          atob(normalizedPayload)
            .split("")
            .map(
              (char) =>
                "%" +
                ("00" + char.charCodeAt(0).toString(16)).slice(-2)
            )
            .join("")
        )
      );

      return normalizeRole(
        payload?.role ||
          payload?.roles ||
          payload?.authorities
      );
    } catch (error) {
      console.error("JWT decode error:", error);
      return null;
    }
  };

  // =====================================================
  // VALIDATE LAB TECH ROLE
  // =====================================================

  const validateLabTechnician = (response) => {
    const token =
      response?.accessToken ||
      response?.token;

    if (!token) {
      clearTokens();

      throw new Error(
        "Login successful, but access token was not returned."
      );
    }

    let role =
      response?.role ||
      response?.roles ||
      response?.authorities;

    role = normalizeRole(role);

    // If role is not in response, check JWT
    if (!role) {
      role = getRoleFromToken(token);
    }

    console.log(
      "Lab Technician detected role:",
      role
    );

    if (role !== "LAB_TECHNICIAN") {
      clearTokens();

      throw new Error(
        "This account does not belong to the Lab Technician portal."
      );
    }

    return true;
  };

  // =====================================================
  // PASSWORD LOGIN
  // =====================================================

  const handlePasswordLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim() || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      // Remove previous user's session
      clearTokens();

      const response =
        await authService.login({
          email: email.trim(),
          password,
        });

      console.log(
        "Lab technician login response:",
        response
      );

      // Check role
      validateLabTechnician(response);

      // authService.login() already saves tokens

      navigate(
        "/lab-technician/dashboard",
        {
          replace: true,
        }
      );
    } catch (err) {
      console.error(
        "Lab technician login failed:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // REQUEST OTP
  // =====================================================

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await authService.requestOtp({
          email: email.trim(),
        });

      console.log(
        "Lab technician OTP request:",
        response
      );

      setSuccess(
        response?.message ||
          "OTP has been sent to your email."
      );

      setOtpStep("otp");
    } catch (err) {
      console.error(
        "OTP request failed:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          "Unable to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // VERIFY OTP
  // =====================================================

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

      // Remove previous session
      clearTokens();

      const response =
        await authService.verifyOtp({
          email: email.trim(),
          otp: otp.trim(),
        });

      console.log(
        "Lab technician OTP response:",
        response
      );

      // IMPORTANT
      // Verify account is actually LAB_TECHNICIAN
      validateLabTechnician(response);

      // authService.verifyOtp()
      // already saves tokens

      navigate(
        "/lab-technician/dashboard",
        {
          replace: true,
        }
      );
    } catch (err) {
      console.error(
        "Lab technician OTP verification failed:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SWITCH MODE
  // =====================================================

  const switchMode = (mode) => {
    setLoginMode(mode);

    setOtpStep("email");
    setOtp("");

    setError("");
    setSuccess("");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F6F9FC]">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =================================================
            LEFT BRANDING
        ================================================= */}

        <div className="relative hidden overflow-hidden bg-[#0d1f3c] lg:flex">

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20" />
          <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-blue-500/10" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* Logo */}

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-2xl font-bold text-white">
                +
              </div>

              <div>

                <h1 className="text-xl font-bold text-white">
                  MediCare
                </h1>

                <p className="text-xs text-blue-200">
                  Hospital Management System
                </p>

              </div>

            </div>

            {/* Main */}

            <div className="max-w-lg">

              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
                <FlaskConical size={34} />
              </div>

              <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Laboratory
                <br />

                <span className="text-blue-400">
                  Management
                </span>
              </h2>

              <p className="mt-6 max-w-md text-base leading-7 text-blue-100">
                Manage laboratory orders, samples,
                test processing and diagnostic reports
                from one secure workspace.
              </p>

              <div className="mt-8 space-y-4">

                <Feature text="Manage laboratory test orders" />

                <Feature text="Track sample collection and processing" />

                <Feature text="Upload and manage diagnostic reports" />

              </div>

            </div>

            <p className="text-xs text-blue-300">
              © {new Date().getFullYear()} MediCare Hospital Management
            </p>

          </div>

        </div>

        {/* =================================================
            LOGIN SECTION
        ================================================= */}

        <div className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-12">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}

            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                +
              </div>

              <div>

                <h1 className="text-xl font-bold text-slate-900">
                  MediCare
                </h1>

                <p className="text-[11px] text-slate-500">
                  Hospital Management
                </p>

              </div>

            </div>

            {/* Header */}

            <div className="mb-7">

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 lg:hidden">
                <FlaskConical size={24} />
              </div>

              <p className="text-sm font-semibold text-blue-600">
                Laboratory Portal
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to access your laboratory workspace.
              </p>

            </div>

            {/* =================================================
                LOGIN MODE TABS
            ================================================= */}

            <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">

              <button
                type="button"
                onClick={() =>
                  switchMode("password")
                }
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
                onClick={() =>
                  switchMode("otp")
                }
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  loginMode === "otp"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Login with OTP
              </button>

            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            {/* =================================================
                PASSWORD LOGIN
            ================================================= */}

            {loginMode === "password" && (

              <form
                onSubmit={handlePasswordLogin}
                className="space-y-5"
              >

                {/* Email */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email address
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="Enter your email"
                      autoComplete="email"
                      disabled={loading}
                      required
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>

                </div>

                {/* Password */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <div className="relative">

                    <LockKeyhole
                      size={18}
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
                      autoComplete="current-password"
                      disabled={loading}
                      required
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (value) => !value
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >

                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}

                    </button>

                  </div>

                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}

                </button>

              </form>

            )}

            {/* =================================================
                OTP LOGIN
            ================================================= */}

            {loginMode === "otp" && (
              <>

                {/* EMAIL STEP */}

                {otpStep === "email" && (

                  <form
                    onSubmit={handleRequestOtp}
                    className="space-y-5"
                  >

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Lab Technician Email
                      </label>

                      <div className="relative">

                        <Mail
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="email"
                          value={email}
                          onChange={(e) =>
                            setEmail(
                              e.target.value
                            )
                          }
                          placeholder="technician@example.com"
                          disabled={loading}
                          required
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />

                      </div>

                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                    >

                      {loading ? (
                        <>
                          <Loader2
                            size={18}
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

                {/* OTP STEP */}

                {otpStep === "otp" && (

                  <form
                    onSubmit={handleVerifyOtp}
                    className="space-y-5"
                  >

                    <div className="rounded-xl bg-blue-50 p-4">

                      <p className="text-sm text-slate-500">
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
                        disabled={loading}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-center text-lg font-semibold tracking-[0.45em] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />

                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                    >

                      {loading ? (
                        <>
                          <Loader2
                            size={18}
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
                      disabled={loading}
                      onClick={() => {
                        setOtpStep("email");
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

            {/* SECURITY */}

            <div className="mt-8 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <ShieldCheck size={17} />
              </div>

              <div>

                <p className="text-xs font-semibold text-slate-700">
                  Secure access
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Your laboratory account is protected
                  by secure authentication.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}


// =====================================================
// FEATURE
// =====================================================

function Feature({ text }) {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
        ✓
      </div>

      <p className="text-sm text-blue-100">
        {text}
      </p>

    </div>
  );
}