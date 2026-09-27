import {
  CalendarDays,
  ArrowRight,
  UserRound,
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

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100">

      <div className="flex items-start gap-4">

        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50 text-blue-600">

          {doctor.image ? (
            <img
              src={doctor.image}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserRound size={35} />
          )}

        </div>

        <div className="min-w-0">

          <h3 className="truncate text-lg font-bold text-slate-900">
            {name}
          </h3>

          <p className="mt-1 text-sm font-medium text-blue-600">
            {specialization}
          </p>

          {experience != null && (
            <p className="mt-1 text-sm text-slate-500">
              {experience}+ years experience
            </p>
          )}

        </div>

      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
        <CalendarDays size={16} />
        View availability
      </div>

      <button
        disabled={!doctorId}
        onClick={() =>
          navigate(`/doctors/${doctorId}`)
        }
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 py-3 font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        View Profile
        <ArrowRight size={17} />
      </button>

    </div>
  );
}

export default DoctorCard;