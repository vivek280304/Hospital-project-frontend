import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import api from "../../services/api";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (form.oldPassword === form.newPassword) {
      setError("New password must be different from old password.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/change-password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      setSuccess("Password changed successfully.");

      setForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/lab-technician/profile");
      }, 1500);
    } catch (err) {
      console.error("Change password error:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to change password.";

      setError(
        typeof message === "string"
          ? message
          : "Failed to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({
    name,
    value,
    placeholder,
    show,
    setShow,
  }) => (
    <div className="relative">
      <Lock
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-11 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate("/lab-technician/profile")}
            className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Change Password
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Update your laboratory technician account password
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          {/* Success */}
          {success && (
            <div className="mb-5 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
              <CheckCircle size={20} />
              <span>{success}</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Old Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Current Password
              </label>

              <PasswordInput
                name="oldPassword"
                value={form.oldPassword}
                placeholder="Enter current password"
                show={showOld}
                setShow={setShowOld}
              />
            </div>

            {/* New Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                New Password
              </label>

              <PasswordInput
                name="newPassword"
                value={form.newPassword}
                placeholder="Enter new password"
                show={showNew}
                setShow={setShowNew}
              />

              <p className="mt-2 text-xs text-gray-500">
                Password must contain at least 8 characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>

              <PasswordInput
                name="confirmPassword"
                value={form.confirmPassword}
                placeholder="Confirm new password"
                show={showConfirm}
                setShow={setShowConfirm}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">

              <button
                type="button"
                onClick={() =>
                  navigate("/lab-technician/profile")
                }
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Changing..." : "Change Password"}
              </button>

            </div>
          </form>
        </div>

        {/* Security note */}
        <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
          <div className="flex gap-3">
            <Lock size={18} className="mt-0.5 shrink-0" />

            <div>
              <p className="font-medium">Security reminder</p>
              <p className="mt-1 text-blue-600">
                Never share your password with anyone. Use a strong,
                unique password for your hospital account.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}