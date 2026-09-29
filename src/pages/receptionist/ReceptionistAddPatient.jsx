import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  UserPlus,
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  VenusAndMars,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ClipboardList,
  RotateCcw,
} from "lucide-react";

import receptionistService from "../../services/receptionistService";

export default function ReceptionistAddPatient() {
  const navigate = useNavigate();

  // =====================================================
  // FORM
  // =====================================================

  const [form, setForm] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =====================================================
  // RESET
  // =====================================================

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      phoneNumber: "",
    });

    setError("");
    setSuccess("");
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    const name =
      form.name.trim();

    const email =
      form.email.trim();

    const phone =
      form.phoneNumber.trim();

    if (!name) {
      return "Please enter patient's full name.";
    }

    if (name.length < 2) {
      return "Patient name must contain at least 2 characters.";
    }

    if (!email) {
      return "Please enter patient's email.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      return "Please enter a valid email address.";
    }

    if (!form.dateOfBirth) {
      return "Please select patient's date of birth.";
    }

    if (!form.gender) {
      return "Please select patient's gender.";
    }

    if (!phone) {
      return "Please enter patient's phone number.";
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return "Phone number must contain exactly 10 digits.";
    }

    return "";
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const requestData = {
        name: form.name.trim(),
        email: form.email.trim(),
        dateOfBirth:
          form.dateOfBirth,
        gender: form.gender,
        phoneNumber:
          form.phoneNumber.trim(),
      };

      const response =
        await receptionistService.createPatient(
          requestData
        );

      console.log(
        "Patient created:",
        response
      );

      setSuccess(
        "Patient registered successfully."
      );

      // Keep successful data visible briefly
      setTimeout(() => {
        navigate(
          "/receptionist/patients"
        );
      }, 1200);
    } catch (err) {
      console.error(
        "Create patient error:",
        err
      );

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Unable to register patient.";

      setError(
        typeof backendMessage ===
          "string"
          ? backendMessage
          : "Unable to register patient."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f5f9fd] text-[#10264a]">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="px-5 lg:px-8 py-4">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/receptionist/patients"
                  )
                }
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition"
              >
                <ArrowLeft
                  size={20}
                />
              </button>

              <div>
                <h1 className="text-xl lg:text-2xl font-bold">
                  Register New Patient
                </h1>

                <p className="text-sm text-slate-500 mt-0.5">
                  Create a new patient record
                  in MediCare
                </p>
              </div>

            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
              <ShieldCheck
                size={16}
              />

              Secure Registration
            </div>

          </div>

        </div>
      </header>

      <main className="max-w-[1200px] mx-auto p-4 lg:p-7">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#e8f4ff] via-[#eef8ff] to-[#dff1ff] border border-blue-100 p-6 lg:p-8 mb-6">

          <div className="relative z-10 max-w-2xl">

            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
              <UserPlus
                size={15}
              />

              PATIENT REGISTRATION
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold mt-4">
              Add a new patient
            </h2>

            <p className="text-slate-500 mt-2 text-sm lg:text-base leading-relaxed">
              Enter the patient's basic
              information below. The patient
              record will be created securely
              in the hospital management system.
            </p>

          </div>

          <div className="absolute right-10 bottom-[-20px] hidden lg:block">

            <div className="w-44 h-44 rounded-full bg-blue-100/80 flex items-center justify-center">

              <div className="w-28 h-28 rounded-3xl bg-white shadow-lg flex items-center justify-center">

                <UserPlus
                  size={54}
                  className="text-blue-600"
                />

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 flex items-start gap-3">

            <CheckCircle2
              size={21}
              className="text-emerald-600 mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold text-emerald-800">
                Patient Registered
              </p>

              <p className="text-sm text-emerald-700 mt-0.5">
                {success}
              </p>
            </div>

          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 flex items-start gap-3">

            <AlertCircle
              size={21}
              className="text-red-600 mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold text-red-800">
                Registration Failed
              </p>

              <p className="text-sm text-red-700 mt-0.5">
                {error}
              </p>
            </div>

          </div>
        )}

        {/* =================================================
            FORM GRID
        ================================================= */}

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >

            {/* FORM HEADER */}

            <div className="px-6 lg:px-8 py-5 border-b border-slate-100">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ClipboardList
                    size={22}
                  />
                </div>

                <div>
                  <h3 className="font-bold text-lg">
                    Patient Information
                  </h3>

                  <p className="text-xs text-slate-400">
                    All fields are required
                  </p>
                </div>

              </div>

            </div>

            {/* FORM BODY */}

            <div className="p-6 lg:p-8">

              <div className="grid md:grid-cols-2 gap-5">

                {/* NAME */}

                <InputField
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter patient's full name"
                  icon={
                    <UserRound
                      size={18}
                    />
                  }
                  required
                />

                {/* EMAIL */}

                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="patient@example.com"
                  icon={
                    <Mail
                      size={18}
                    />
                  }
                  required
                />

                {/* PHONE */}

                <InputField
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="10 digit mobile number"
                  icon={
                    <Phone
                      size={18}
                    />
                  }
                  maxLength={10}
                  required
                />

                {/* DOB */}

                <InputField
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={
                    form.dateOfBirth
                  }
                  onChange={handleChange}
                  icon={
                    <CalendarDays
                      size={18}
                    />
                  }
                  required
                />

                {/* GENDER */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Gender
                    <span className="text-red-500 ml-1">
                      *
                    </span>
                  </label>

                  <div className="grid grid-cols-3 gap-3">

                    <GenderButton
                      value="Male"
                      selected={
                        form.gender ===
                        "Male"
                      }
                      onClick={() =>
                        setForm(
                          (previous) => ({
                            ...previous,
                            gender: "Male",
                          })
                        )
                      }
                    />

                    <GenderButton
                      value="Female"
                      selected={
                        form.gender ===
                        "Female"
                      }
                      onClick={() =>
                        setForm(
                          (previous) => ({
                            ...previous,
                            gender:
                              "Female",
                          })
                        )
                      }
                    />

                    <GenderButton
                      value="Other"
                      selected={
                        form.gender ===
                        "Other"
                      }
                      onClick={() =>
                        setForm(
                          (previous) => ({
                            ...previous,
                            gender: "Other",
                          })
                        )
                      }
                    />

                  </div>

                </div>

              </div>

              {/* DIVIDER */}

              <div className="border-t border-slate-100 my-7" />

              {/* NOTICE */}

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">

                <ShieldCheck
                  size={20}
                  className="text-blue-600 mt-0.5 shrink-0"
                />

                <div>

                  <p className="font-semibold text-sm text-blue-800">
                    Patient information
                  </p>

                  <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                    Please make sure the patient's
                    name, email, phone number and
                    date of birth are entered
                    correctly before submitting.
                  </p>

                </div>

              </div>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-7">

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RotateCcw
                    size={17}
                  />

                  Clear Form
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/receptionist/patients"
                    )
                  }
                  disabled={loading}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm disabled:bg-blue-300"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />

                      Registering...
                    </>
                  ) : (
                    <>
                      <UserPlus
                        size={18}
                      />

                      Register Patient
                    </>
                  )}
                </button>

              </div>

            </div>

          </form>

          {/* =================================================
              RIGHT INFORMATION PANEL
          ================================================= */}

          <div className="space-y-5">

            {/* PROFILE PREVIEW */}

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

              <h3 className="font-bold text-lg">
                Patient Preview
              </h3>

              <p className="text-xs text-slate-400 mt-1 mb-5">
                Information entered in the form
              </p>

              <div className="flex flex-col items-center text-center">

                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 mb-3">

                  {form.name ? (
                    <span className="text-2xl font-bold">
                      {form.name
                        .charAt(
                          0
                        )
                        .toUpperCase()}
                    </span>
                  ) : (
                    <UserRound
                      size={34}
                    />
                  )}

                </div>

                <h4 className="font-bold">
                  {form.name ||
                    "Patient Name"}
                </h4>

                <p className="text-xs text-slate-400 mt-1">
                  New Patient
                </p>

              </div>

              <div className="mt-5 space-y-3">

                <PreviewRow
                  icon={
                    <Mail
                      size={16}
                    />
                  }
                  label="Email"
                  value={
                    form.email ||
                    "Not entered"
                  }
                />

                <PreviewRow
                  icon={
                    <Phone
                      size={16}
                    />
                  }
                  label="Phone"
                  value={
                    form.phoneNumber ||
                    "Not entered"
                  }
                />

                <PreviewRow
                  icon={
                    <CalendarDays
                      size={16}
                    />
                  }
                  label="Date of Birth"
                  value={
                    form.dateOfBirth ||
                    "Not selected"
                  }
                />

                <PreviewRow
                  icon={
                    <VenusAndMars
                      size={16}
                    />
                  }
                  label="Gender"
                  value={
                    form.gender ||
                    "Not selected"
                  }
                />

              </div>

            </section>

            {/* PROCESS */}

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

              <h3 className="font-bold">
                Registration Process
              </h3>

              <div className="mt-5 space-y-4">

                <ProcessStep
                  number="1"
                  title="Enter Information"
                  description="Fill in the patient's details."
                  active
                />

                <ProcessStep
                  number="2"
                  title="Verify Details"
                  description="Check the information before submitting."
                />

                <ProcessStep
                  number="3"
                  title="Create Patient"
                  description="The record is saved in MediCare."
                />

              </div>

            </section>

            {/* SECURITY */}

            <section className="rounded-2xl bg-gradient-to-br from-[#10264a] to-[#173c70] text-white p-5">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <ShieldCheck
                    size={21}
                  />
                </div>

                <div>
                  <h3 className="font-bold">
                    Secure Registration
                  </h3>

                  <p className="text-xs text-blue-100 mt-0.5">
                    MediCare Hospital System
                  </p>
                </div>

              </div>

              <p className="text-xs text-blue-100 leading-relaxed mt-4">
                Patient information is submitted
                directly to the hospital management
                backend through the authenticated
                receptionist portal.
              </p>

            </section>

          </div>

        </div>

      </main>
    </div>
  );
}

// =======================================================
// INPUT FIELD
// =======================================================

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  required,
  maxLength,
}) {
  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}

        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}
      </label>

      <div className="relative">

        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          className="w-full h-12 pl-11 pr-4 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
        />

      </div>

    </div>
  );
}

// =======================================================
// GENDER BUTTON
// =======================================================

function GenderButton({
  value,
  selected,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-12 rounded-xl border font-semibold text-sm transition ${
        selected
          ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white hover:border-blue-200"
      }`}
    >
      {value}
    </button>
  );
}

// =======================================================
// PREVIEW ROW
// =======================================================

function PreviewRow({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[10px] text-slate-400">
          {label}
        </p>

        <p className="text-xs font-semibold text-slate-700 truncate">
          {value}
        </p>

      </div>

    </div>
  );
}

// =======================================================
// PROCESS STEP
// =======================================================

function ProcessStep({
  number,
  title,
  description,
  active = false,
}) {
  return (
    <div className="flex gap-3">

      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
          active
            ? "bg-blue-600 text-white"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {number}
      </div>

      <div>

        <p className="text-sm font-semibold">
          {title}
        </p>

        <p className="text-xs text-slate-400 mt-0.5">
          {description}
        </p>

      </div>

    </div>
  );
}