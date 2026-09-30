import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserPlus,
  Mail,
  Lock,
  BriefcaseMedical,
  Award,
  Building2,
  Stethoscope,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import adminService from "../../services/adminService";

function AdminCreateUser() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    licenseNumber: "",
    specialization: "",
    experience: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;

    setFormData((prev) => ({
      ...prev,
      role,
      specialization: "",
      experience: "",
      licenseNumber: "",
      department: "",
    }));

    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Name is required.";
    }

    if (!formData.email.trim()) {
      return "Email is required.";
    }

    if (!formData.password) {
      return "Password is required.";
    }

    if (formData.password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (!formData.role) {
      return "Please select a role.";
    }

    // Doctor-specific validation
    if (formData.role === "DOCTOR") {
      if (!formData.specialization.trim()) {
        return "Specialization is required for Doctor.";
      }

      if (
        formData.experience === "" ||
        formData.experience === null
      ) {
        return "Experience is required for Doctor.";
      }

      if (Number(formData.experience) < 0) {
        return "Experience cannot be negative.";
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        licenseNumber: formData.licenseNumber.trim() || null,
        specialization:
          formData.role === "DOCTOR"
            ? formData.specialization.trim()
            : null,
        experience:
          formData.role === "DOCTOR"
            ? Number(formData.experience)
            : null,
        department: formData.department.trim() || null,
      };

      console.log("CREATE USER PAYLOAD:", payload);

      const response = await adminService.createUser(payload);

      console.log("CREATE USER RESPONSE:", response);

      setSuccess(
        `${formData.role} account created successfully.`
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        licenseNumber: "",
        specialization: "",
        experience: "",
        department: "",
      });
    } catch (err) {
      console.error("CREATE USER ERROR:", err);
      console.error("STATUS:", err.response?.status);
      console.error("DATA:", err.response?.data);

      const backendError = err.response?.data;

      if (typeof backendError === "string") {
        setError(backendError);
      } else if (backendError?.message) {
        setError(backendError.message);
      } else if (backendError?.errors) {
        const errors = Object.values(backendError.errors);

        setError(
          errors.length
            ? errors.join(", ")
            : "Failed to create user."
        );
      } else {
        setError("Failed to create user. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Users
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <UserPlus size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Create User
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Create a new hospital staff account.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success */}
      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-semibold">Success</p>
            <p className="mt-1">{success}</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-semibold">Unable to create user</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        {/* Basic Information */}
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Basic Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enter the staff member's account details.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Full Name <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <UserPlus
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="staff@hospital.com"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  className={inputClass}
                  minLength={8}
                  required
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Role <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <BriefcaseMedical
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleRoleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select role</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="NURSE">Nurse</option>
                  <option value="RECEPTIONIST">
                    Receptionist
                  </option>
                  <option value="LAB_TECHNICIAN">
                    Lab Technician
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Stethoscope size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Professional Information
              </h2>

              <p className="text-sm text-slate-500">
                Optional for most staff. Required fields depend
                on the selected role.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {/* License Number */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                License Number
                <span className="ml-2 text-xs font-normal text-slate-400">
                  Optional
                </span>
              </label>

              <div className="relative">
                <Award
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="Medical license number"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Department
                <span className="ml-2 text-xs font-normal text-slate-400">
                  Optional
                </span>
              </label>

              <div className="relative">
                <Building2
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. Emergency, ICU"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Doctor fields */}
            {formData.role === "DOCTOR" && (
              <>
                {/* Specialization */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Specialization{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Stethoscope
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder="e.g. Cardiologist"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Experience (Years){" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Award
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="e.g. 5"
                      min="0"
                      step="1"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Doctor note */}
          {formData.role === "DOCTOR" && (
            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">
                  Doctor account:
                </span>{" "}
                Specialization and experience are required.
                License number and department remain optional.
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create User
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdminCreateUser;