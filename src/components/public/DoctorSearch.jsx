import { Search } from "lucide-react";

function DoctorSearch({
  specialization,
  onSearch,
}) {
  const specializations = [
    "All",
    "Cardiologist",
    "Dermatologist",
    "Orthopedics",
    "Neurologist",
    "Pediatrician",
    "General Medicine",
    "Gynecologist",
  ];

  return (
    <div className="w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-start gap-3 sm:items-center sm:gap-4">

        {/* ICON */}

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 sm:h-12 sm:w-12 sm:rounded-full">
          <Search size={22} />
        </div>


        {/* TITLE */}

        <div className="min-w-0">

          <h2 className="text-xl font-bold leading-tight text-slate-900 sm:text-2xl">
            Find Your Doctor
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
            Search doctors by specialization
          </p>

        </div>

      </div>


      {/* =====================================================
          SEARCH BAR
      ===================================================== */}

      <div className="mt-5 grid gap-3 sm:mt-6 md:grid-cols-[minmax(0,1fr)_auto]">

        {/* INPUT */}

        <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50">

          <Search
            size={19}
            className="shrink-0 text-slate-400"
          />

          <input
            type="text"
            value={specialization}
            onChange={(e) =>
              onSearch(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch(specialization);
              }
            }}
            placeholder="Search by specialization..."
            className="
              min-w-0
              w-full
              bg-transparent
              py-3.5
              text-sm
              text-slate-800
              outline-none
              placeholder:text-slate-400
              sm:text-base
            "
          />

        </div>


        {/* SEARCH BUTTON */}

        <button
          type="button"
          onClick={() =>
            onSearch(specialization)
          }
          className="
            flex
            min-h-[50px]
            w-full
            items-center
            justify-center
            rounded-xl
            bg-blue-600
            px-7
            text-sm
            font-bold
            text-white
            transition
            hover:bg-blue-700
            md:w-auto
          "
        >
          Search
        </button>

      </div>


      {/* =====================================================
          SPECIALIZATIONS
      ===================================================== */}

      <div className="mt-6 border-t border-slate-100 pt-5">

        <div className="mb-3">

          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Popular Specializations
          </p>

        </div>


        {/* RESPONSIVE GRID */}

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">

          {specializations.map((spec) => {

            const value =
              spec === "All"
                ? ""
                : spec;

            const active =
              specialization === value;

            return (
              <button
                type="button"
                key={spec}
                onClick={() =>
                  onSearch(value)
                }
                className={`
                  flex
                  min-h-[42px]
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  border
                  px-2
                  py-2
                  text-center
                  text-[11px]
                  font-semibold
                  leading-4
                  transition
                  sm:text-xs
                  ${
                    active
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                  }
                `}
              >
                {spec}
              </button>
            );
          })}

        </div>

      </div>

    </div>
  );
}

export default DoctorSearch;