import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  KeyRound,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import receptionistService from "../../services/receptionistService";

export default function ReceptionistProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await receptionistService.getProfile();

      setProfile(data);
    } catch (err) {
      console.error("Failed to load receptionist profile:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (!profile?.name) return "R";

    return profile.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f9fd]">
        <div className="flex flex-col items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <Loader2
              size={30}
              className="animate-spin text-blue-600"
            />
          </div>

          <div className="text-center">
            <p className="font-semibold text-slate-700">
              Loading your profile
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Please wait a moment...
            </p>
          </div>

        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f9fd] px-5 py-10">

        <div className="mx-auto mt-16 max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <UserRound size={28} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-800">
            Unable to load profile
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            onClick={loadProfile}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f9fd] text-slate-800">

      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">

        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4 lg:px-8">

          {/* LEFT */}

          <div className="flex items-center gap-4">

            <button
              onClick={() =>
                navigate("/receptionist/dashboard")
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              <ArrowLeft size={19} />
            </button>

            <div>

              <h1 className="text-lg font-bold text-slate-800">
                My Profile
              </h1>

              <p className="text-xs text-slate-500">
                Personal and professional information
              </p>

            </div>

          </div>


          {/* RIGHT */}

          <button
            onClick={() =>
              navigate("/receptionist/change-password")
            }
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <KeyRound size={16} />

            <span className="hidden sm:inline">
              Security
            </span>
          </button>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-[1200px] px-5 py-7 lg:px-8">


        {/* ===================================================
            PROFILE HERO
        =================================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* BLUE COVER */}

          <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[#0f4cbd] via-[#1769e0] to-[#38a3ff]">

            {/* Decorative circles */}

            <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[45px] border-white/10" />

            <div className="absolute -bottom-28 right-28 h-60 w-60 rounded-full border-[35px] border-white/10" />

            <div className="absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-white/5" />


            {/* BRAND */}

            <div className="absolute left-7 top-7">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                  <ShieldCheck
                    size={23}
                    className="text-white"
                  />
                </div>

                <div>

                  <p className="text-sm font-bold tracking-wide text-white">
                    MediCare
                  </p>

                  <p className="text-xs text-blue-100">
                    Receptionist Portal
                  </p>

                </div>

              </div>

            </div>


            {/* ACCOUNT STATUS */}

            <div className="absolute right-6 top-6 hidden sm:block">

              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm">

                <span className="h-2 w-2 rounded-full bg-emerald-300" />

                <span className="text-xs font-semibold text-white">
                  Account Active
                </span>

              </div>

            </div>

          </div>


          {/* PROFILE INFORMATION */}

          <div className="relative px-6 pb-7 lg:px-8">

            <div className="-mt-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

              {/* LEFT */}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

                {/* AVATAR */}

                <div className="relative">

                  <div className="flex h-28 w-28 items-center justify-center rounded-3xl border-[5px] border-white bg-gradient-to-br from-blue-50 to-blue-100 text-3xl font-extrabold text-blue-600 shadow-xl">
                    {getInitials()}
                  </div>


                  {/* ONLINE DOT */}

                  <div className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-emerald-500">

                    <span className="h-2 w-2 rounded-full bg-white" />

                  </div>

                </div>


                {/* NAME */}

                <div className="pb-1">

                  <div className="flex flex-wrap items-center gap-2">

                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">
                      {profile?.name || "Receptionist"}
                    </h2>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold tracking-wide text-blue-700">
                      RECEPTIONIST
                    </span>

                  </div>


                  {/* EMAIL / PHONE */}

                  <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2">

                    {profile?.email && (
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">

                        <Mail
                          size={15}
                          className="text-blue-500"
                        />

                        <span>
                          {profile.email}
                        </span>

                      </div>
                    )}


                    {(profile?.phoneNumber ||
                      profile?.phone) && (
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">

                        <Phone
                          size={15}
                          className="text-blue-500"
                        />

                        <span>
                          {profile.phoneNumber ||
                            profile.phone}
                        </span>

                      </div>
                    )}

                  </div>

                </div>

              </div>


              {/* SECURITY BUTTON */}

              <div className="flex flex-col gap-3 sm:flex-row">

                <button
                  onClick={() =>
                    navigate(
                      "/receptionist/change-password"
                    )
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  <KeyRound size={17} />

                  Change Password
                </button>

              </div>

            </div>


            {/* QUICK INFORMATION */}

            <div className="mt-7 grid gap-3 border-t border-slate-100 pt-6 sm:grid-cols-3">

              <QuickProfileInfo
                icon={
                  <BriefcaseBusiness size={18} />
                }
                label="Role"
                value="Receptionist"
              />

              <QuickProfileInfo
                icon={
                  <Building2 size={18} />
                }
                label="Department"
                value={
                  profile?.department ||
                  "Front Desk"
                }
              />

              <QuickProfileInfo
                icon={
                  <CheckCircle2 size={18} />
                }
                label="Account Status"
                value="Active"
                active
              />

            </div>

          </div>

        </section>


        {/* ===================================================
            MAIN INFORMATION
        =================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">


          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* HEADER */}

            <div className="border-b border-slate-100 px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <UserRound size={20} />
                </div>

                <div>

                  <h3 className="font-bold text-slate-800">
                    Personal Information
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Your registered account details
                  </p>

                </div>

              </div>

            </div>


            {/* CONTENT */}

            <div className="grid gap-4 p-6 sm:grid-cols-2">

              <ProfileItem
                icon={<UserRound size={18} />}
                label="Full Name"
                value={profile?.name}
              />

              <ProfileItem
                icon={<Mail size={18} />}
                label="Email Address"
                value={profile?.email}
              />

              <ProfileItem
                icon={<Phone size={18} />}
                label="Phone Number"
                value={
                  profile?.phoneNumber ||
                  profile?.phone
                }
              />

              <ProfileItem
                icon={
                  <BriefcaseBusiness size={18} />
                }
                label="Role"
                value="Receptionist"
              />

            </div>

          </section>


          {/* =================================================
              PROFESSIONAL INFORMATION
          ================================================= */}

          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* HEADER */}

            <div className="border-b border-slate-100 px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Building2 size={20} />
                </div>

                <div>

                  <h3 className="font-bold text-slate-800">
                    Professional Information
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Your hospital role
                  </p>

                </div>

              </div>

            </div>


            {/* CONTENT */}

            <div className="space-y-1 p-6">

              <DetailRow
                label="Employee ID"
                value={
                  profile?.employeeId ||
                  profile?.employeeID ||
                  profile?.id
                    ? `REC-${
                        profile?.employeeId ||
                        profile?.employeeID ||
                        profile?.id
                      }`
                    : "Not available"
                }
              />

              <DetailRow
                label="Department"
                value={
                  profile?.department ||
                  "Front Desk"
                }
              />

              <DetailRow
                label="Designation"
                value="Receptionist"
              />

              <DetailRow
                label="Status"
                value={
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">

                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                    Active

                  </span>
                }
              />

            </div>

          </section>

        </div>


        {/* ===================================================
            CONTACT + SECURITY
        =================================================== */}

        <div className="mt-6 grid gap-6 md:grid-cols-2">


          {/* =================================================
              CONTACT
          ================================================= */}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Phone size={21} />
              </div>

              <div>

                <h3 className="font-bold text-slate-800">
                  Contact Information
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Your registered contact details are
                  used for account-related communication.
                </p>

              </div>

            </div>


            <div className="mt-5 space-y-3">

              <ContactRow
                icon={<Mail size={17} />}
                label="Email"
                value={
                  profile?.email ||
                  "Not available"
                }
              />

              <ContactRow
                icon={<Phone size={17} />}
                label="Phone"
                value={
                  profile?.phoneNumber ||
                  profile?.phone ||
                  "Not available"
                }
              />

            </div>

          </section>


          {/* =================================================
              SECURITY
          ================================================= */}

          <section className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-6 shadow-sm">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <ShieldCheck size={21} />
              </div>

              <div>

                <h3 className="font-bold text-slate-800">
                  Account Security
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Keep your MediCare account secure by
                  regularly updating your password.
                </p>

              </div>

            </div>


            <button
              onClick={() =>
                navigate(
                  "/receptionist/change-password"
                )
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
            >
              <KeyRound size={17} />

              Change Password
            </button>

          </section>

        </div>

      </main>

    </div>
  );
}


/* =====================================================
   QUICK PROFILE INFO
===================================================== */

function QuickProfileInfo({
  icon,
  label,
  value,
  active = false,
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3.5">

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          active
            ? "bg-emerald-50 text-emerald-600"
            : "bg-blue-50 text-blue-600"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p
          className={`mt-0.5 truncate text-sm font-bold ${
            active
              ? "text-emerald-600"
              : "text-slate-800"
          }`}
        >
          {value}
        </p>

      </div>

    </div>
  );
}


/* =====================================================
   PROFILE ITEM
===================================================== */

function ProfileItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="group rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-blue-100 hover:bg-blue-50/40">

      <div className="flex items-center gap-2 text-slate-400">

        <span className="transition group-hover:text-blue-500">
          {icon}
        </span>

        <span className="text-[10px] font-bold uppercase tracking-wider">
          {label}
        </span>

      </div>

      <p className="mt-2 break-words text-sm font-bold text-slate-800">
        {value || "Not available"}
      </p>

    </div>
  );
}


/* =====================================================
   DETAIL ROW
===================================================== */

function DetailRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-4 last:border-0">

      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-right text-sm font-bold text-slate-800">
        {value || "Not available"}
      </span>

    </div>
  );
}


/* =====================================================
   CONTACT ROW
===================================================== */

function ContactRow({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3.5">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
        {icon}
      </div>

      <div className="min-w-0">

        {label && (
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>
        )}

        <p className="mt-0.5 break-all text-sm font-semibold text-slate-700">
          {value}
        </p>

      </div>

    </div>
  );
}