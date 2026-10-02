import { useState } from "react";
import { Eye, EyeOff, FlaskConical, LockKeyhole, Mail, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import authService from "../../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await authService.login({
        email: email.trim(),
        password,
      });

      console.log("Lab technician login successful:", response);

      navigate("/lab-technician/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error("Lab technician login failed:", err);

      setError(
        err.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F9FC]">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left branding section */}
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

            {/* Main message */}
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
                Manage laboratory orders, samples, test processing
                and diagnostic reports from one secure workspace.
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

        {/* Login section */}
        <div className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-12">

          <div className="w-full max-w-md">

            {/* Mobile logo */}
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
            <div className="mb-8">

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

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    disabled={loading}
                    required
                  />

                </div>

              </div>

              {/* Password */}
              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/forgot-password")
                    }
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="relative">

                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    disabled={loading}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((value) => !value)
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

              {/* Submit */}
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

            {/* Security */}
            <div className="mt-8 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <LockKeyhole size={17} />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Secure access
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Your laboratory account is protected by secure
                  authentication.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

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