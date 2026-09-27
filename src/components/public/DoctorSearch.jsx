import { Search } from "lucide-react";

function DoctorSearch({ specialization, onSearch }) {
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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* HEADER */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <Search size={25} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Find Your Doctor
          </h2>

          <p className="text-sm text-slate-500">
            Search doctors by specialization
          </p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex gap-3">

        <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-5">
          <Search size={20} className="text-slate-400" />

          <input
            type="text"
            value={specialization}
            onChange={(e) => onSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch(specialization);
              }
            }}
            placeholder="Search by specialization..."
            className="w-full bg-transparent py-4 text-base outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => onSearch(specialization)}
          className="rounded-xl bg-blue-600 px-10 font-semibold text-white hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* SPECIALIZATIONS */}
      <div className="mt-6 flex flex-wrap items-center gap-2">

        <span className="mr-3 text-sm font-bold text-slate-800">
          Popular Specializations
        </span>

        {specializations.map((spec) => {
          const value = spec === "All" ? "" : spec;
          const active = specialization === value;

          return (
            <button
              type="button"
              key={spec}
              onClick={() => onSearch(value)}
              className={`rounded-full border px-5 py-2 text-sm transition ${
                active
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600"
              }`}
            >
              {spec}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DoctorSearch;