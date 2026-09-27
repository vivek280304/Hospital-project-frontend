import { useState } from "react";
import { ShieldCheck, HeartPulse } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../../../services/authService";

function PatientVerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    location.state?.email || ""
  );

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const verifyOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await authService.verifyRegistration({
        email,
        otp,
      });

      setMessage(
        "Registration verified successfully. You can now login."
      );

      setTimeout(() => {
        navigate("/patient/login");
      }, 1200);

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setResending(true);
      setError("");
      setMessage("");

      await authService.resendRegistrationOtp({
        email,
      });

      setMessage("A new OTP has been sent.");

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to resend OTP."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <HeartPulse size={30} />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Verify Your Account
          </h1>

          <p className="mt-2 text-slate-500">
            Enter the OTP sent to your email.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-xl">

          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-blue-100 p-4 text-blue-600">
              <ShieldCheck size={32} />
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">
              {message}
            </div>
          )}

          <form onSubmit={verifyOtp} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Verification OTP
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                placeholder="Enter 6 digit OTP"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-xl tracking-[0.5em] outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading
                ? "Verifying..."
                : "Verify Registration"}
            </button>

          </form>

          <button
            onClick={resendOtp}
            disabled={resending || !email}
            className="mt-5 w-full text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            {resending
              ? "Sending..."
              : "Resend OTP"}
          </button>

          <button
            onClick={() => navigate("/patient/login")}
            className="mt-4 w-full text-sm text-slate-500"
          >
            ← Back to Login
          </button>

        </div>
      </div>
    </div>
  );
}

export default PatientVerifyOtp;