import { useState } from "react";
import { HeartPulse } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import PasswordLoginForm from "../../../components/auth/PasswordLoginForm";
import OtpLoginForm from "../../../components/auth/OtpLoginForm";
import authService from "../../../services/authService";

function PatientLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
   * Appointment selected before login.
   *
   * Example:
   *
   * {
   *   doctorId: 12,
   *   appointmentDate: "2026-09-28",
   *   appointmentTime: "10:30"
   * }
   */
  const appointmentData =
    location.state?.appointmentData || null;

  console.log(
    "Appointment data received by login:",
    appointmentData
  );

  /*
   * Decide where the patient goes after successful login.
   */
  const goAfterLogin = () => {
    console.log(
      "Redirecting after login:",
      appointmentData
    );

    /*
     * Patient selected a doctor slot before login.
     *
     * Go to appointment booking page.
     */
    if (appointmentData) {
      navigate("/patient/book-appointment", {
        state: appointmentData,
        replace: true,
      });

      return;
    }

    /*
     * Normal patient login.
     */
    navigate("/patient/dashboard", {
      replace: true,
    });
  };

  const handleLogin = async (data) => {
    try {
      setLoading(true);
      setError("");

      const response = await authService.login(data);

      if (response.role !== "PATIENT") {
        setError(
          "This account does not belong to the Patient portal."
        );
        return;
      }

      goAfterLogin();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (data) => {
    try {
      setLoading(true);
      setError("");

      await authService.requestOtp(data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to send OTP."
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (data) => {
    try {
      setLoading(true);
      setError("");

      const response = await authService.verifyOtp(data);

      if (response.role !== "PATIENT") {
        setError(
          "This account does not belong to the Patient portal."
        );
        return;
      }

      goAfterLogin();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* BRANDING */}
        <div className="hidden bg-gradient-to-br from-blue-700 to-cyan-500 p-12 text-white lg:flex lg:flex-col lg:justify-between">

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-3">
              <HeartPulse size={30} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                MediCare
              </h1>

              <p className="text-sm text-blue-100">
                Hospital Management System
              </p>
            </div>
          </div>

          <div className="max-w-lg">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-100">
              Patient Portal
            </p>

            <h2 className="text-5xl font-bold leading-tight">
              Your healthcare,
              <br />
              all in one place.
            </h2>

            <p className="mt-6 text-lg leading-8 text-blue-50">
              Book appointments, access medical reports,
              manage lab tests and stay connected with
              your healthcare team.
            </p>
          </div>

          <p className="text-sm text-blue-100">
            © 2026 MediCare Hospital
          </p>

        </div>

        {/* LOGIN */}
        <div className="flex items-center justify-center p-6 sm:p-10">

          <div className="w-full max-w-md">

            <div className="mb-8 text-center lg:text-left">

              <div className="mb-5 flex justify-center lg:hidden">
                <div className="rounded-2xl bg-blue-600 p-4 text-white">
                  <HeartPulse size={30} />
                </div>
              </div>

              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
                Patient Portal
              </p>

              <h2 className="text-3xl font-bold text-slate-900">
                Welcome Back
              </h2>

              <p className="mt-2 text-slate-500">
                Sign in to manage your healthcare.
              </p>

            </div>

            <div className="rounded-3xl bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9">

              {/* LOGIN TABS */}
              <div className="mb-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1">

                <button
                  type="button"
                  onClick={() => {
                    setMode("password");
                    setError("");
                  }}
                  className={`rounded-lg py-2.5 text-sm font-semibold ${
                    mode === "password"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  Password
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode("otp");
                    setError("");
                  }}
                  className={`rounded-lg py-2.5 text-sm font-semibold ${
                    mode === "otp"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  OTP Login
                </button>

              </div>

              {/* ERROR */}
              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* LOGIN FORM */}
              {mode === "password" ? (
                <PasswordLoginForm
                  onSubmit={handleLogin}
                  loading={loading}
                  onOtpLogin={() => {
                    setMode("otp");
                    setError("");
                  }}
                  onForgotPassword={() =>
                    navigate("/patient/forgot-password")
                  }
                />
              ) : (
                <OtpLoginForm
                  onRequestOtp={handleRequestOtp}
                  onVerifyOtp={handleVerifyOtp}
                  loading={loading}
                  onBack={() => {
                    setMode("password");
                    setError("");
                  }}
                />
              )}

              {/* REGISTER */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs text-slate-400">
                  NEW PATIENT?
                </span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/patient/register")
                }
                className="w-full rounded-xl border border-slate-200 py-3.5 font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
              >
                Create Patient Account
              </button>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default PatientLogin;