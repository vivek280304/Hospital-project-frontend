import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LockKeyhole,
} from "lucide-react";

import authService from "../../services/authService";

export default function ReceptionistChangePassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      form.newPassword !==
      form.confirmPassword
    ) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await authService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setMessage(
        "Password changed successfully."
      );

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Unable to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-5 lg:p-8">
      <div className="max-w-xl mx-auto">
        <button
          onClick={() =>
            navigate("/receptionist/dashboard")
          }
          className="flex items-center gap-2 text-slate-500 mb-6"
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>

        <div className="bg-white border rounded-2xl p-7">
          <div className="flex items-center gap-4 mb-7">
            <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <LockKeyhole />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Change Password
              </h1>

              <p className="text-slate-500">
                Update your account password.
              </p>
            </div>
          </div>

          {message && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4 mb-5">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-5">
              {error}
            </div>
          )}

          <form
            onSubmit={submit}
            className="space-y-5"
          >
            <PasswordInput
              label="Current Password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={change}
            />

            <PasswordInput
              label="New Password"
              name="newPassword"
              value={form.newPassword}
              onChange={change}
            />

            <PasswordInput
              label="Confirm New Password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={change}
            />

            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold"
            >
              {loading
                ? "Updating..."
                : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function PasswordInput({
  label,
  ...props
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">
        {label}
      </label>

      <input
        type="password"
        {...props}
        className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
  );
}