import {
  CalendarDays,
  ArrowRight,
  UserRound,
  BriefcaseBusiness,
  CircleCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function DoctorCard({ doctor }) {
  const navigate = useNavigate();

  const doctorId =
    doctor.id ??
    doctor.doctorId ??
    doctor.userId;

  const name =
    doctor.name ??
    doctor.fullName ??
    doctor.doctorName ??
    doctor.user?.name ??
    "Doctor";

  const specialization =
    doctor.specialization ??
    doctor.department ??
    "General Medicine";

  const experience =
    doctor.experience ??
    doctor.yearsOfExperience;

  // Get available days from schedules
  const availableDays = Array.isArray(doctor.schedules)
    ? [
        ...new Set(
          doctor.schedules
            .map((schedule) => schedule?.day)
            .filter(Boolean)
        ),
      ]
    : [];

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60">

      {/* DOCTOR IMAGE */}
      <div className="relative flex h-48 items-end justify-center overflow-hidden bg-gradient-to-b from-blue-50 to-slate-100">

        {doctor.image ? (
          <img
            src={doctor.image}
            alt={name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="mb-0 flex h-36 w-36 items-center justify-center rounded-full bg-white text-blue-500 shadow-sm">
            <UserRound
              size={72}
              strokeWidth={1.4}
            />
          </div>
        )}

        {/* VERIFIED */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-green-600 shadow-sm">
          <CircleCheck size={14} />
          Verified
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">

        <h3 className="truncate text-lg font-bold text-[#10255c]">
          {name}
        </h3>

        <p className="mt-1 text-sm font-semibold text-blue-600">
          {specialization}
        </p>

        {/* EXPERIENCE */}
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <BriefcaseBusiness size={16} />

          <span>
            {experience != null
              ? `${experience}+ years experience`
              : "Experienced Doctor"}
          </span>
        </div>

       
      {/* AVAILABLE DAYS */}
<div className="mt-4">

  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
    <CalendarDays
      size={16}
      className="text-green-600"
    />
    <span>Available Days</span>
  </div>

  <div className="mt-2 flex flex-wrap gap-2">
    {availableDays.length > 0 ? (
      availableDays.map((day) => (
        <span
          key={day}
          className="rounded-md bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700"
        >
          {String(day).slice(0, 3).toUpperCase()}
        </span>
      ))
    ) : (
      <span className="text-xs text-slate-400">
        Not available
      </span>
    )}
  </div>

</div>

        {/* BUTTON */}
        <button
          type="button"
          disabled={!doctorId}
          onClick={() =>
            navigate(`/doctors/${doctorId}`)
          }
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          View Profile

          <ArrowRight
            size={17}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>

      </div>
    </div>
  );
}

export default DoctorCard;