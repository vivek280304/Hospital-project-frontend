import {
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  VenusAndMars,
  ShieldCheck,
  Hash,
  CircleCheck,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";

export default function Profile() {
  const { profile } = useOutletContext();

  const patientId =
    profile?.id != null
      ? `P-${String(profile.id).padStart(5, "0")}`
      : "Not available";

  return (
    <Page
      title="My Profile"
      subtitle="View your personal and patient information"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

        {/* =====================================================
            MAIN PROFILE
        ===================================================== */}

        <section
          className="
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-[0_2px_10px_rgba(15,23,42,0.04)]
          "
        >

          {/* PROFILE HEADER */}

          <div
            className="
              relative
              overflow-hidden
              bg-blue-600
              px-5
              py-7
              text-white

              sm:px-7
              sm:py-8
            "
          >

            {/* Decorative circles */}

            <div
              className="
                absolute
                -right-12
                -top-16
                h-40
                w-40
                rounded-full
                bg-white/10
              "
            />

            <div
              className="
                absolute
                -bottom-16
                right-28
                h-32
                w-32
                rounded-full
                bg-white/10
              "
            />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">

              {/* AVATAR */}

              <div
                className="
                  flex
                  h-20
                  w-20
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border-4
                  border-white/30
                  bg-white
                  text-blue-600
                  shadow-lg

                  sm:h-24
                  sm:w-24
                "
              >
                <UserRound
                  size={42}
                  strokeWidth={1.5}
                />
              </div>

              {/* PROFILE NAME */}

              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-2">

                  <span
                    className="
                      flex
                      items-center
                      gap-1
                      rounded-full
                      bg-white/15
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                    "
                  >
                    <CircleCheck size={12} />

                    Active Patient
                  </span>

                </div>

                <h2
                  className="
                    mt-2
                    truncate
                    text-2xl
                    font-extrabold

                    sm:text-3xl
                  "
                >
                  {profile?.name || "Patient"}
                </h2>

                <p className="mt-1 text-sm text-blue-100">
                  MediCare Patient
                </p>

              </div>

            </div>

          </div>


          {/* PATIENT ID */}

          <div className="border-b border-slate-100 px-5 py-4 sm:px-7">

            <div
              className="
                flex
                flex-col
                gap-2

                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div className="flex items-center gap-2">

                <Hash
                  size={16}
                  className="text-blue-600"
                />

                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Patient ID
                </span>

              </div>

              <span
                className="
                  w-fit
                  rounded-lg
                  bg-blue-50
                  px-3
                  py-1.5
                  font-mono
                  text-xs
                  font-bold
                  text-blue-600
                "
              >
                {patientId}
              </span>

            </div>

          </div>


          {/* PERSONAL INFORMATION */}

          <div className="p-5 sm:p-7">

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                "
              >
                <UserRound size={19} />
              </div>

              <div>

                <h3 className="font-bold text-slate-900">
                  Personal Information
                </h3>

                <p className="text-xs text-slate-400">
                  Your registered patient details
                </p>

              </div>

            </div>


            {/* INFO GRID */}

            <div
              className="
                mt-6
                grid
                gap-3

                sm:grid-cols-2
              "
            >

              <Info
                icon={Mail}
                label="Email Address"
                value={profile?.email}
              />

              <Info
                icon={Phone}
                label="Phone Number"
                value={profile?.phoneNumber}
              />

              <Info
                icon={CalendarDays}
                label="Date of Birth"
                value={profile?.dateOfBirth}
              />

              <Info
                icon={VenusAndMars}
                label="Gender"
                value={profile?.gender}
              />

            </div>

          </div>

        </section>


        {/* =====================================================
            RIGHT SIDEBAR
        ===================================================== */}

        <aside className="space-y-4">

          {/* ACCOUNT STATUS */}

          <section
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-[0_2px_10px_rgba(15,23,42,0.04)]
            "
          >

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-emerald-50
                text-emerald-600
              "
            >
              <ShieldCheck size={24} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              Account Status
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your MediCare patient account is active and
              available for appointments and medical records.
            </p>

            <div
              className="
                mt-5
                flex
                items-center
                gap-2
                rounded-xl
                bg-emerald-50
                px-3
                py-2.5
              "
            >
              <CircleCheck
                size={16}
                className="text-emerald-600"
              />

              <span className="text-xs font-semibold text-emerald-700">
                Account Active
              </span>
            </div>

          </section>


          {/* PROFILE SUMMARY */}

          <section
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-[0_2px_10px_rgba(15,23,42,0.04)]
            "
          >

            <h3 className="font-bold text-slate-900">
              Profile Summary
            </h3>

            <div className="mt-5 space-y-4">

              <Summary
                label="Role"
                value="Patient"
              />

              <Summary
                label="Patient ID"
                value={patientId}
              />

              <Summary
                label="Email"
                value={profile?.email || "Not available"}
              />

            </div>

          </section>

        </aside>

      </div>
    </Page>
  );
}


/* =============================================================
   INFO CARD
============================================================= */

function Info({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-100
        bg-slate-50
        p-4
        transition

        hover:border-blue-100
        hover:bg-blue-50/40
      "
    >

      <div className="flex items-center gap-3">

        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-white
            text-blue-600
            shadow-sm
          "
        >
          <Icon size={18} />
        </div>

        <div className="min-w-0">

          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-slate-400
            "
          >
            {label}
          </p>

          <p
            className="
              mt-1
              truncate
              text-sm
              font-semibold
              text-slate-700
            "
          >
            {value || "Not available"}
          </p>

        </div>

      </div>

    </div>
  );
}


/* =============================================================
   SUMMARY
============================================================= */

function Summary({
  label,
  value,
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">

      <span className="text-xs text-slate-400">
        {label}
      </span>

      <span className="max-w-[180px] truncate text-right text-xs font-semibold text-slate-700">
        {value}
      </span>

    </div>
  );
}


/* =============================================================
   PAGE
============================================================= */

function Page({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="mx-auto max-w-7xl">

      <div className="mb-6">

        <div className="flex items-center gap-2">

          <span className="h-2 w-2 rounded-full bg-blue-600" />

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-blue-600
            "
          >
            Patient Portal
          </p>

        </div>

        <h1
          className="
            mt-2
            text-2xl
            font-bold
            tracking-tight
            text-slate-900

            sm:text-3xl
          "
        >
          {title}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {subtitle}
        </p>

      </div>

      {children}

    </div>
  );
}