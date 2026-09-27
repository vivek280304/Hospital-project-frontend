import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  UserRound,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import doctorService from "../../services/doctorService";

function DoctorDetails() {

  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const loadDoctor = async () => {

      try {

        setLoading(true);

        const data =
          await doctorService.getDoctorById(
            doctorId
          );

        console.log(
          "GET /api/doctors/" + doctorId,
          data
        );

        setDoctor(data);

      } catch (error) {

        console.error(error);

        setError(
          error.response?.data?.message ||
          "Unable to load doctor."
        );

      } finally {

        setLoading(false);

      }
    };

    loadDoctor();

  }, [doctorId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2
          size={40}
          className="animate-spin text-blue-600"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">

        <p className="text-red-600">
          {error}
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-white"
        >
          Back Home
        </button>

      </div>
    );
  }

  if (!doctor) return null;

  const name =
    doctor.name ??
    doctor.fullName ??
    doctor.doctorName ??
    "Doctor";

  const specialization =
    doctor.specialization ??
    doctor.department ??
    "General Medicine";

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center px-6 py-5">

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back to Doctors
          </button>

        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">

        <div className="rounded-3xl bg-white p-8 shadow-sm">

          <div className="flex flex-col gap-8 md:flex-row">

            <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">

              {doctor.image ? (
                <img
                  src={doctor.image}
                  alt={name}
                  className="h-full w-full rounded-3xl object-cover"
                />
              ) : (
                <UserRound size={70} />
              )}

            </div>

            <div>

              <p className="font-semibold text-blue-600">
                Doctor Profile
              </p>

              <h1 className="mt-2 text-4xl font-bold">
                {name}
              </h1>

              <p className="mt-2 text-xl text-slate-500">
                {specialization}
              </p>

              {doctor.experience != null && (
                <p className="mt-4 text-slate-600">
                  {doctor.experience}+ years experience
                </p>
              )}

              <button
                onClick={() =>
                  navigate(
                    `/doctors/${doctorId}/slots`
                  )
                }
                className="mt-7 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                <CalendarDays size={19} />
                Check Available Slots
              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default DoctorDetails;