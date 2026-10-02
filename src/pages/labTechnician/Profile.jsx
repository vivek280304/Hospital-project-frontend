import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  BadgeCheck,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import { useOutletContext, useNavigate } from "react-router-dom";
import labTechnicianService from "../../services/labTechnicianService";

export default function Profile() {
  const navigate = useNavigate();

  const outletContext = useOutletContext();

  const profileFromLayout =
    outletContext?.profile;

  const reloadProfile =
    outletContext?.reloadProfile;

  const [profile, setProfile] = useState(
    profileFromLayout || null
  );

  const [loading, setLoading] = useState(
    !profileFromLayout
  );

  const [error, setError] = useState("");

  useEffect(() => {
    if (profileFromLayout) {
      setProfile(profileFromLayout);
      setLoading(false);
      return;
    }

    loadProfile();
  }, [profileFromLayout]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await labTechnicianService.getProfile();

      setProfile(data);
    } catch (err) {
      console.error(
        "Failed to load profile:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load profile."
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        navigate(
          "/lab-technician/login",
          {
            replace: true,
          }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadProfile();

    if (reloadProfile) {
      await reloadProfile();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <Loader2
            size={32}
            className="mx-auto mb-3 animate-spin text-blue-600"
          />

          <p className="text-sm text-gray-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Profile
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View your laboratory technician account
            information
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="
            inline-flex items-center
            justify-center gap-2
            rounded-lg
            border border-gray-200
            bg-white
            px-4 py-2.5
            text-sm font-medium
            text-gray-700
            shadow-sm
            hover:bg-gray-50
            disabled:opacity-60
          "
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>


      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

          <AlertCircle size={19} />

          <span>{error}</span>

        </div>
      )}


      {profile && (
        <div className="grid gap-6 lg:grid-cols-3">

          {/* =================================
              PROFILE CARD
          ================================= */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex flex-col items-center text-center">

              <div className="
                flex h-24 w-24
                items-center justify-center
                rounded-full
                bg-blue-100
                text-blue-600
              ">
                <UserRound size={44} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-900">
                {profile.name ||
                  "Lab Technician"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Laboratory Technician
              </p>

              <div className="
                mt-4 inline-flex
                items-center gap-2
                rounded-full
                bg-green-50
                px-3 py-1.5
                text-xs font-medium
                text-green-700
              ">
                <CheckCircle2 size={14} />
                Active
              </div>

            </div>

            <div className="mt-7 border-t border-gray-100 pt-5">

              <div className="flex items-center gap-3">

                <ShieldCheck
                  size={19}
                  className="text-blue-600"
                />

                <div>
                  <p className="text-xs text-gray-400">
                    Role
                  </p>

                  <p className="text-sm font-medium text-gray-800">
                    Laboratory Technician
                  </p>
                </div>

              </div>

            </div>

          </div>


          {/* =================================
              ACCOUNT INFORMATION
          ================================= */}

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm lg:col-span-2">

            <div className="border-b border-gray-100 px-6 py-5">

              <h2 className="font-semibold text-gray-900">
                Account Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your registered account details
              </p>

            </div>

            <div className="space-y-1 p-6">

              {/* Name */}

              <ProfileItem
                icon={UserRound}
                label="Full Name"
                value={
                  profile.name ||
                  "Not available"
                }
              />

              {/* Email */}

              <ProfileItem
                icon={Mail}
                label="Email Address"
                value={
                  profile.email ||
                  "Not available"
                }
              />

              {/* ID */}

              <ProfileItem
                icon={BadgeCheck}
                label="Technician ID"
                value={
                  profile.id ||
                  "Not available"
                }
              />

              {/* Role */}

              <ProfileItem
                icon={ShieldCheck}
                label="Role"
                value="Laboratory Technician"
              />

            </div>

          </div>

        </div>
      )}


      {/* =====================================
          SECURITY
      ===================================== */}

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="font-semibold text-gray-900">
              Account Security
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Keep your account password secure.
            </p>

          </div>

          <button
            onClick={() =>
              navigate(
                "/lab-technician/change-password"
              )
            }
            className="
              rounded-lg
              bg-blue-600
              px-5 py-2.5
              text-sm font-medium
              text-white
              hover:bg-blue-700
            "
          >
            Change Password
          </button>

        </div>

      </div>

    </div>
  );
}


function ProfileItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="
      flex items-center
      gap-4
      rounded-xl
      p-4
      transition
      hover:bg-gray-50
    ">

      <div className="
        flex h-10 w-10
        shrink-0
        items-center
        justify-center
        rounded-lg
        bg-blue-50
        text-blue-600
      ">
        <Icon size={19} />
      </div>

      <div className="min-w-0">

        <p className="text-xs text-gray-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-medium text-gray-800">
          {value}
        </p>

      </div>

    </div>
  );
}