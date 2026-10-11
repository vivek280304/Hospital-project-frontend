import { useEffect, useState } from "react";
import doctorService from "../../services/doctorService";
import DoctorCard from "./DoctorCard";

function DoctorList({ specialization }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDoctors();
  }, [specialization]);

  async function loadDoctors() {
    try {
      setLoading(true);
      setError("");

      console.log(
        "Loading doctors. Specialization:",
        specialization
      );

      const data = await doctorService.getDoctors(
        specialization
      );

      console.log("Doctors response:", data);

      if (Array.isArray(data)) {
        setDoctors(data);
      } else if (Array.isArray(data?.doctors)) {
        setDoctors(data.doctors);
      } else if (Array.isArray(data?.data)) {
        setDoctors(data.data);
      } else {
        setDoctors([]);
      }

    } catch (err) {
      console.error("Doctor API error:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load doctors"
      );

      setDoctors([]);

    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500">
          Loading doctors...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="font-semibold text-red-600">
          Unable to load doctors
        </p>

        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="rounded-xl bg-white py-12 text-center">
        <p className="text-slate-500">
          No doctors found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {doctors.map((doctor) => (
        <DoctorCard
          key={
            doctor.id ??
            doctor.doctorId ??
            doctor.userId
          }
          doctor={doctor}
        />
      ))}
    </div>
  );
}

export default DoctorList;