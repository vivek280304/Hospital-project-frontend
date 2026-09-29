import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseMedical,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import doctorService from "../../services/doctorService";

function DoctorProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await doctorService.getProfile();

      setProfile(data);
    } catch (err) {
      console.error("Doctor profile error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load doctor profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={() => navigate("/doctor/dashboard")}
              className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
            >
              <ArrowLeft size={22} />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Doctor Profile
              </h1>

              <p className="text-sm text-slate-500">
                View your professional information
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={loadProfile}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />

            Refresh
          </button>

        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
            <RefreshCw
              size={30}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-4 text-sm text-slate-500">
              Loading doctor profile...
            </p>
          </div>
        ) : profile ? (
          <>
            {/* Profile Hero */}
            <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-7 text-white shadow-sm">

              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <UserRound size={48} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">

                    <h2 className="text-3xl font-bold">
                      {profile.name ||
                        profile.doctorName ||
                        "Doctor"}
                    </h2>

                    <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                      <ShieldCheck size={14} />
                      Verified
                    </span>

                  </div>

                  <p className="mt-2 text-blue-50">
                    {profile.specialization ||
                      "Medical Specialist"}
                  </p>

                </div>

              </div>

            </section>

            {/* Profile Details */}
            <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Name */}
              <ProfileCard
                icon={<UserRound size={22} />}
                label="Full Name"
                value={
                  profile.name ||
                  profile.doctorName ||
                  "Not available"
                }
              />

              {/* Email */}
              <ProfileCard
                icon={<Mail size={22} />}
                label="Email"
                value={profile.email || "Not available"}
              />

              {/* License */}
              <ProfileCard
                icon={<ShieldCheck size={22} />}
                label="License Number"
                value={
                  profile.licenseNumber ||
                  "Not available"
                }
              />

              {/* Specialization */}
              <ProfileCard
                icon={<BriefcaseMedical size={22} />}
                label="Specialization"
                value={
                  profile.specialization ||
                  "Not available"
                }
              />

              {/* Experience */}
              <ProfileCard
                icon={<BriefcaseMedical size={22} />}
                label="Experience"
                value={
                  profile.experience != null
                    ? `${profile.experience} years`
                    : "Not available"
                }
              />

            </section>

          </>
        ) : (
          <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">
              Doctor profile not available.
            </p>
          </div>
        )}

      </main>
    </div>
  );
}

function ProfileCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">

      <div className="flex items-start gap-4">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <div className="min-w-0">

          <p className="text-sm text-slate-500">
            {label}
          </p>

          <p className="mt-1 break-words text-lg font-semibold text-slate-900">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}

export default DoctorProfile;