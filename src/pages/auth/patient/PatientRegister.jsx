import { useState } from "react";
import { HeartPulse, User, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import authService from "../../../services/authService";

function PatientRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);
    setError("");

    await authService.register(form);

    navigate("/patient/verify-otp", {
      state: {
        email: form.email,
      },
    });
  } catch (error) {
    console.error("PATIENT REGISTRATION ERROR:", error);

    setError(
      error.response?.data?.message ||
        error.response?.data ||
        "Registration failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Branding */}
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
              Patient Registration
            </p>

            <h2 className="text-5xl font-bold leading-tight">
              Start your
              <br />
              healthcare journey.
            </h2>

            <p className="mt-6 text-lg leading-8 text-blue-50">
              Create your MediCare account to book
              appointments and securely access your
              healthcare information.
            </p>
          </div>

          <p className="text-sm text-blue-100">
            © 2026 MediCare Hospital
          </p>
        </div>

        {/* Form */}
        <div className="flex items-center justify-center p-6 sm:p-10">

          <div className="w-full max-w-md">

            <div className="mb-8 text-center lg:text-left">
              <div className="mb-5 flex justify-center lg:hidden">
                <div className="rounded-2xl bg-blue-600 p-4 text-white">
                  <HeartPulse size={30} />
                </div>
              </div>

              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Patient Portal
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Create Account
              </h2>

              <p className="mt-2 text-slate-500">
                Register as a new patient.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9">

              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading
                    ? "Creating Account..."
                    : "Create Account"}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <button
                  onClick={() =>
                    navigate("/patient/login")
                  }
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Login
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PatientRegister;