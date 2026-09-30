import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import authService from "../../../services/authService";

export default function PatientResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email) {
      setError("Email is missing. Please start the reset process again.");
      return;
    }

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await authService.resetPassword({
        email,
        otp: otp.trim(),
        newPassword,
      });

      setSuccess("Password reset successfully.");

      setTimeout(() => {
        navigate("/patient/login");
      }, 1500);

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

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white mb-4">
            <Lock size={28} />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Reset Password
          </h1>

          <p className="text-slate-500 mt-2">
            Create a new password for your MediCare account
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8">

          {email && (
            <div className="mb-5 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
              <p className="text-sm text-slate-600">
                Resetting password for
              </p>

              <p className="font-semibold text-blue-700 break-all">
                {email}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* OTP */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                OTP
              </label>

              <div className="relative">
                <KeyRound
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  maxLength={6}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                New Password
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-11 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-11 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

          </form>

          <button
            onClick={() => navigate("/patient/login")}
            className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Login
          </button>

        </div>
      </div>
    </div>
  );
}