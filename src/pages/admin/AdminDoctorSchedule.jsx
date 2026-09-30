import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  UserRound,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
} from "lucide-react";

import adminService from "../../services/adminService";
import doctorService from "../../services/doctorService";

function AdminSchedules() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    doctorId: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    slotDuration: "",
  });

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // LOAD DOCTORS
  // ==========================================
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoadingDoctors(true);

        const data = await doctorService.getDoctors();

        console.log("DOCTORS:", data);

        setDoctors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("LOAD DOCTORS ERROR:", err);

        setError(
          err.response?.data?.message ||
            err.response?.data ||
            "Failed to load doctors."
        );
      } finally {
        setLoadingDoctors(false);
      }
    };

    loadDoctors();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ==========================================
  // VALIDATION
  // ==========================================
  const validateForm = () => {
    if (!formData.doctorId) {
      return "Please select a doctor.";
    }

    if (!formData.dayOfWeek) {
      return "Please select a day.";
    }

    if (!formData.startTime) {
      return "Start time is required.";
    }

    if (!formData.endTime) {
      return "End time is required.";
    }

    if (formData.startTime >= formData.endTime) {
      return "End time must be after start time.";
    }

    if (!formData.slotDuration) {
      return "Slot duration is required.";
    }

    if (Number(formData.slotDuration) <= 0) {
      return "Slot duration must be greater than 0.";
    }

    return null;
  };

  // ==========================================
  // SUBMIT
  // ==========================================
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
        doctorId: Number(formData.doctorId),
        dayOfWeek: formData.dayOfWeek,
        startTime: formData.startTime,
        endTime: formData.endTime,
        slotDuration: Number(formData.slotDuration),
      };

      console.log("CREATE DOCTOR SCHEDULE PAYLOAD:", payload);

      const response =
        await adminService.createDoctorSchedule(payload);

      console.log(
        "CREATE DOCTOR SCHEDULE RESPONSE:",
        response
      );

      const selectedDoctor = doctors.find(
        (doctor) =>
          Number(doctor.id) === Number(formData.doctorId)
      );

      setSuccess(
        `Schedule created successfully${
          selectedDoctor?.name
            ? ` for ${selectedDoctor.name}`
            : ""
        }.`
      );

      // Reset form
      setFormData({
        doctorId: "",
        dayOfWeek: "",
        startTime: "",
        endTime: "",
        slotDuration: "",
      });
    } catch (err) {
      console.error(
        "CREATE DOCTOR SCHEDULE ERROR:",
        err
      );

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
            : "Failed to create doctor schedule."
        );
      } else {
        setError(
          "Failed to create doctor schedule. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <div className="space-y-6">
      {/* ==========================================
          HEADER
      ========================================== */}
      <div>
        <button
          type="button"
          onClick={() => navigate("/admin/dashboard")}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <CalendarDays size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Doctor Schedules
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create working schedules and appointment slots
              for doctors.
            </p>
          </div>
        </div>
      </div>

      {/* ==========================================
          SUCCESS MESSAGE
      ========================================== */}
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

      {/* ==========================================
          ERROR MESSAGE
      ========================================== */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-semibold">
              Unable to create schedule
            </p>

            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* ==========================================
          FORM
      ========================================== */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        {/* Form Header */}
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Stethoscope size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Create Doctor Schedule
              </h2>

              <p className="text-sm text-slate-500">
                Select the doctor and define their working
                hours.
              </p>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="p-5 sm:p-6">
          <div className="grid gap-5 md:grid-cols-2">
            {/* ========================================
                DOCTOR
            ======================================== */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Doctor <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                />

                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  disabled={loadingDoctors}
                  className={`${inputClass} pl-11`}
                  required
                >
                  <option value="">
                    {loadingDoctors
                      ? "Loading doctors..."
                      : "Select doctor"}
                  </option>

                  {doctors.map((doctor) => (
                    <option
                      key={doctor.id}
                      value={doctor.id}
                    >
                      {doctor.name}
                      {doctor.specialization
                        ? ` — ${doctor.specialization}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ========================================
                DAY
            ======================================== */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Day <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <CalendarDays
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  name="dayOfWeek"
                  value={formData.dayOfWeek}
                  onChange={handleChange}
                  className={`${inputClass} pl-11`}
                  required
                >
                  <option value="">Select day</option>

                  <option value="MONDAY">Monday</option>
                  <option value="TUESDAY">Tuesday</option>
                  <option value="WEDNESDAY">
                    Wednesday
                  </option>
                  <option value="THURSDAY">Thursday</option>
                  <option value="FRIDAY">Friday</option>
                  <option value="SATURDAY">Saturday</option>
                  <option value="SUNDAY">Sunday</option>
                </select>
              </div>
            </div>

            {/* ========================================
                SLOT DURATION
            ======================================== */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Slot Duration{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <Clock3
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  name="slotDuration"
                  value={formData.slotDuration}
                  onChange={handleChange}
                  className={`${inputClass} pl-11`}
                  required
                >
                  <option value="">
                    Select duration
                  </option>

                  <option value="15">15 minutes</option>
                  <option value="20">20 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>
            </div>

            {/* ========================================
                START TIME
            ======================================== */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Start Time{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            {/* ========================================
                END TIME
            ======================================== */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                End Time{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* ==========================================
              SCHEDULE PREVIEW
          ========================================== */}
          {(formData.doctorId ||
            formData.dayOfWeek ||
            formData.startTime ||
            formData.endTime ||
            formData.slotDuration) && (
            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Schedule Preview
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {formData.dayOfWeek && (
                  <span className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
                    {formData.dayOfWeek.charAt(0) +
                      formData.dayOfWeek
                        .slice(1)
                        .toLowerCase()}
                  </span>
                )}

                {formData.startTime &&
                  formData.endTime && (
                    <span className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
                      {formData.startTime} -{" "}
                      {formData.endTime}
                    </span>
                  )}

                {formData.slotDuration && (
                  <span className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
                    {formData.slotDuration} min slots
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ==========================================
              ACTIONS
          ========================================== */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                navigate("/admin/dashboard")
              }
              className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || loadingDoctors}
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
                  <Plus size={18} />
                  Create Schedule
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdminSchedules;