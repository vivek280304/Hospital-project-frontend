import { useEffect, useMemo, useState } from "react";
import {
  Stethoscope,
  ChevronRight,
  Loader2,
  UserRound,
  Users,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import doctorService from "../../services/doctorService";

export default function Doctors() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // =========================================================
  // LOAD DOCTORS
  // =========================================================

  useEffect(() => {
    doctorService
      .getDoctors("")
      .then((d) => {
        setData(
          Array.isArray(d)
            ? d
            : d?.doctors || d?.data || []
        );
      })
      .catch((e) => {
        setError(
          e.response?.data?.message ||
            e.message ||
            "Unable to load doctors."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // =========================================================
  // NORMALIZE DOCTORS
  // =========================================================

  const doctors = useMemo(() => {
    return data.map((doctor) => ({
      id:
        doctor.id ??
        doctor.doctorId ??
        doctor.userId,

      name:
        doctor.name ??
        doctor.fullName ??
        doctor.doctorName ??
        doctor.user?.name ??
        "Doctor",

      specialization:
        doctor.specialization ??
        doctor.department ??
        "General Medicine",

      email:
        doctor.email ??
        doctor.user?.email ??
        "",

      phone:
        doctor.phone ??
        doctor.phoneNumber ??
        "",

      experience:
        doctor.experience ??
        doctor.experienceYears ??
        null,

      qualification:
        doctor.qualification ??
        doctor.degree ??
        doctor.education ??
        "",

      department:
        doctor.department ??
        doctor.specialization ??
        "General Medicine",
    }));
  }, [data]);

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <Page
      title="Find a Doctor"
      subtitle="Browse our doctors and find the right specialist for your care"
    >
      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-blue-100
          bg-blue-50
          px-5
          py-5

          sm:px-6
          sm:py-6
        "
      >
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-white
                text-blue-600
                shadow-sm
              "
            >
              <Stethoscope size={22} />
            </div>

            <div>
              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-blue-600
                "
              >
                Healthcare Team
              </p>

              <h2 className="mt-0.5 text-lg font-bold text-slate-900">
                Our Doctors
              </h2>
            </div>

          </div>

          <p className="mt-4 text-sm leading-6 text-slate-600">
            Browse our healthcare professionals and choose
            a doctor for your appointment.
          </p>
        </div>

        {/* Decorative shapes */}

        <div
          className="
            absolute
            -right-8
            -top-10
            h-32
            w-32
            rounded-full
            bg-blue-100/70
          "
        />

        <div
          className="
            absolute
            -bottom-14
            right-20
            h-28
            w-28
            rounded-full
            bg-white/60
          "
        />
      </section>


      {/* =====================================================
          DOCTOR COUNT
      ===================================================== */}

      {!loading && !error && (
        <div
          className="
            mt-5
            flex
            items-center
            justify-between
            rounded-2xl
            border
            border-slate-200
            bg-white
            px-5
            py-4
            shadow-[0_2px_8px_rgba(15,23,42,0.04)]
          "
        >
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
              <Users size={19} />
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Healthcare Team
              </p>

              <p className="text-sm font-bold text-slate-800">
                Available Doctors
              </p>
            </div>

          </div>

          <div
            className="
              rounded-full
              bg-blue-50
              px-3
              py-1.5
              text-sm
              font-bold
              text-blue-600
            "
          >
            {doctors.length}
          </div>
        </div>
      )}


      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div
          className="
            mt-5
            flex
            min-h-[300px]
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-slate-200
            bg-white
          "
        >
          <Loader2
            size={28}
            className="animate-spin text-blue-600"
          />

          <p className="mt-3 text-sm text-slate-500">
            Loading doctors...
          </p>
        </div>
      )}


      {/* =====================================================
          ERROR
      ===================================================== */}

      {!loading && error && (
        <div
          className="
            mt-5
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-6
            text-center
          "
        >
          <p className="text-sm font-semibold text-red-600">
            Unable to load doctors
          </p>

          <p className="mt-1 text-xs text-red-500">
            {error}
          </p>
        </div>
      )}


      {/* =====================================================
          EMPTY
      ===================================================== */}

      {!loading &&
        !error &&
        doctors.length === 0 && (
          <div className="mt-5">
            <Empty text="No doctors found." />
          </div>
        )}


      {/* =====================================================
          DOCTOR GRID
      ===================================================== */}

      {!loading &&
        !error &&
        doctors.length > 0 && (
          <div
            className="
              mt-5
              grid
              gap-4

              sm:grid-cols-2
              xl:grid-cols-3
            "
          >
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onView={() =>
                  navigate(
                    `/doctors/${doctor.id}`
                  )
                }
              />
            ))}
          </div>
        )}
    </Page>
  );
}


/* =============================================================
   DOCTOR CARD
============================================================= */

function DoctorCard({
  doctor,
  onView,
}) {
  return (
    <article
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-[0_2px_8px_rgba(15,23,42,0.04)]
        transition-all
        duration-200

        hover:-translate-y-0.5
        hover:border-blue-200
        hover:shadow-[0_8px_24px_rgba(37,99,235,0.09)]
      "
    >

      {/* =====================================================
          CARD TOP
      ===================================================== */}

      <div className="p-5">

        <div className="flex items-start gap-4">

          {/* AVATAR */}

          <div
            className="
              relative
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-blue-50
              text-blue-600
            "
          >
            <UserRound size={27} />

            {/* Availability */}

            <span
              className="
                absolute
                bottom-0
                right-0
                h-3.5
                w-3.5
                rounded-full
                border-2
                border-white
                bg-green-500
              "
            />
          </div>


          {/* DOCTOR INFO */}

          <div className="min-w-0 flex-1">

            <h3
              className="
                truncate
                text-base
                font-bold
                text-slate-900
              "
            >
              {doctor.name}
            </h3>

            <p
              className="
                mt-1
                truncate
                text-sm
                font-medium
                text-blue-600
              "
            >
              {doctor.specialization}
            </p>

            {doctor.qualification && (
              <p className="mt-1 truncate text-xs text-slate-400">
                {doctor.qualification}
              </p>
            )}

          </div>

        </div>


        {/* =================================================
            INFORMATION
        ================================================= */}

        <div
          className="
            mt-5
            grid
            grid-cols-2
            gap-2
          "
        >

          <InfoBox
            icon={<Stethoscope size={15} />}
            label="Specialization"
            value={doctor.specialization}
          />

          <InfoBox
            icon={<Building2 size={15} />}
            label="Department"
            value={doctor.department}
          />

        </div>

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          border-t
          border-slate-100
          bg-slate-50/70
          px-5
          py-3
        "
      >

        <div className="flex items-center gap-2">

          <span
            className="
              h-2
              w-2
              rounded-full
              bg-green-500
            "
          />

          <span className="text-xs font-medium text-slate-500">
            Available
          </span>

        </div>


        <button
          type="button"
          onClick={onView}
          className="
            flex
            items-center
            gap-1
            rounded-lg
            px-2
            py-1.5
            text-xs
            font-bold
            text-blue-600
            transition

            hover:bg-blue-50
          "
        >
          View Doctor

          <ChevronRight
            size={15}
            className="
              transition-transform
              group-hover:translate-x-0.5
            "
          />
        </button>

      </div>

    </article>
  );
}


/* =============================================================
   INFO BOX
============================================================= */

function InfoBox({
  icon,
  label,
  value,
}) {
  return (
    <div
      className="
        min-w-0
        rounded-xl
        bg-slate-50
        px-3
        py-2.5
      "
    >

      <div className="flex items-center gap-1.5">

        <span className="shrink-0 text-blue-500">
          {icon}
        </span>

        <span
          className="
            truncate
            text-[9px]
            font-bold
            uppercase
            tracking-wide
            text-slate-400
          "
        >
          {label}
        </span>

      </div>

      <p
        className="
          mt-1
          truncate
          text-xs
          font-semibold
          text-slate-700
        "
      >
        {value || "Not available"}
      </p>

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
    <div className="min-h-full bg-[#F6F9FC]">

      <div className="mx-auto max-w-7xl">

        <div className="mb-5">

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

    </div>
  );
}


/* =============================================================
   EMPTY
============================================================= */

function Empty({ text }) {
  return (
    <div
      className="
        flex
        min-h-[300px]
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-slate-200
        bg-white
        px-5
        text-center
      "
    >

      <div
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-blue-50
          text-blue-600
        "
      >
        <Users size={25} />
      </div>


      <p className="mt-4 text-sm font-semibold text-slate-700">
        {text}
      </p>


      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
        Doctors available at MediCare will appear here.
      </p>

    </div>
  );
}