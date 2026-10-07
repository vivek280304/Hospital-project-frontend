import { useState } from "react";

import Navbar from "../../components/public/Navbar";
import Hero from "../../components/public/Hero";
import DoctorSearch from "../../components/public/DoctorSearch";
import DoctorList from "../../components/public/DoctorList";

function Home() {
  const [specialization, setSpecialization] = useState("");

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">

      <Navbar />

      <main>

        {/* HERO */}
        <Hero />

        {/* =====================================================
            DOCTOR SEARCH
        ===================================================== */}

        <section
          id="doctor-search"
          className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
        >
          <DoctorSearch
            specialization={specialization}
            onSearch={setSpecialization}
          />
        </section>


        {/* =====================================================
            DOCTORS
        ===================================================== */}

        <section
          className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16"
        >

          <div className="mb-6 sm:mb-8">

            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl lg:text-3xl">
              Our Top Doctors
            </h2>

            <p className="mt-1.5 text-sm leading-6 text-slate-500 sm:text-base">
              Find and book appointments with our doctors
            </p>

          </div>

          <DoctorList
            specialization={specialization}
          />

        </section>

      </main>

    </div>
  );
}

export default Home;