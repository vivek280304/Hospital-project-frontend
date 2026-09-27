import { useState } from "react";

import Navbar from "../../components/public/Navbar";
import Hero from "../../components/public/Hero";
import DoctorSearch from "../../components/public/DoctorSearch";
import DoctorList from "../../components/public/DoctorList";

function Home() {
  const [specialization, setSpecialization] = useState("");

  return (
    <div className="min-h-screen bg-slate-50">

      <Navbar />

      <Hero />

      {/* DOCTOR SEARCH */}
      <section
        id="doctor-search"
        className="mx-auto max-w-7xl px-5 py-8"
      >
        <DoctorSearch
          specialization={specialization}
          onSearch={setSpecialization}
        />
      </section>

      {/* DOCTORS */}
      <section className="mx-auto max-w-7xl px-5 pb-12">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Our Top Doctors
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Find and book appointments with our doctors
          </p>
        </div>

        <DoctorList
          specialization={specialization}
        />

      </section>

    </div>
  );
}

export default Home;