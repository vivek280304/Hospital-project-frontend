import { useState } from "react";
import { LockKeyhole, HeartPulse } from "lucide-react";
import { useNavigate } from "react-router-dom";
import authService from "../../../services/authService";

function PatientForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await authService.forgotPassword({
        email,
      });

      navigate("/patient/reset-password", {
        state: {
          email,
        },
      });

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to send reset OTP."
      );
    } finally {
      setLoading(false);
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
            Forgot Password?
          </h1>

          <p className="mt-2 text-slate-500">
            We'll send an OTP to reset your password.
          </p>

        </div>

        <div className="rounded-3xl bg-white p-8 shadow-xl">

          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-blue-100 p-4 text-blue-600">
              <LockKeyhole size={30} />
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Registered Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading
                ? "Sending OTP..."
                : "Send Reset OTP"}
            </button>

          </form>

          <button
            onClick={() => navigate("/patient/login")}
            className="mt-6 w-full text-sm font-medium text-slate-500 hover:text-blue-600"
          >
            ← Back to Login
          </button>

        </div>
      </div>
    </div>
  );
}

export default PatientForgotPassword;