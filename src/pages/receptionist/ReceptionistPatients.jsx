import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  UserPlus,
  Users,
  UserRound,
  Phone,
  Mail,
  CalendarDays,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  ClipboardList,
} from "lucide-react";

import receptionistService from "../../services/receptionistService";

export default function ReceptionistPatients() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [search, setSearch] = useState("");

  const [patients, setPatients] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [hasSearched, setHasSearched] =
    useState(false);

  const [selectedPatient, setSelectedPatient] =
    useState(null);

  // =====================================================
  // SEARCH PATIENTS
  // =====================================================

  const searchPatients = async (
    searchValue = search
  ) => {
    const query =
      searchValue.trim();

    if (!query) {
      setPatients([]);
      setHasSearched(false);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setHasSearched(true);

      const data =
        await receptionistService.searchPatients(
          query
        );

      setPatients(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Patient search error:",
        err
      );

      setPatients([]);

      setError(
        err?.response?.data?.message ||
          "Unable to search patients."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ENTER KEY
  // =====================================================

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchPatients();
    }
  };

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const clearSearch = () => {
    setSearch("");
    setPatients([]);
    setHasSearched(false);
    setError("");
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const refresh = () => {
    if (search.trim()) {
      searchPatients();
    }
  };

  // =====================================================
  // VIEW PATIENT
  // =====================================================

  const viewPatient = (patient) => {
    if (!patient?.id) {
      return;
    }

    navigate(
      `/receptionist/patients/${patient.id}`
    );
  };

  // =====================================================
  // BOOK APPOINTMENT
  // =====================================================

  const bookAppointment = (patient) => {
    navigate(
      "/receptionist/appointments/book",
      {
        state: {
          patientId: patient.id,
          patient,
        },
      }
    );
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsed =
      new Date(`${date}T00:00:00`);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return date;
    }

    return parsed.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // CALCULATE AGE
  // =====================================================

  const calculateAge = (
    dateOfBirth
  ) => {
    if (!dateOfBirth) {
      return "-";
    }

    const dob = new Date(
      `${dateOfBirth}T00:00:00`
    );

    if (
      Number.isNaN(
        dob.getTime()
      )
    ) {
      return "-";
    }

    const today = new Date();

    let age =
      today.getFullYear() -
      dob.getFullYear();

    const monthDifference =
      today.getMonth() -
      dob.getMonth();

    if (
      monthDifference < 0 ||
      (
        monthDifference === 0 &&
        today.getDate() <
          dob.getDate()
      )
    ) {
      age--;
    }

    return age;
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f5f9fd] text-[#10264a]">

      {/* =================================================
          TOP HEADER
      ================================================= */}

      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="px-5 lg:px-8 py-4">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <button
                onClick={() =>
                  navigate(
                    "/receptionist/dashboard"
                  )
                }
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center"
              >
                <ChevronLeft
                  size={20}
                />
              </button>

              <div>
                <h1 className="text-xl lg:text-2xl font-bold">
                  Patient Management
                </h1>

                <p className="text-sm text-slate-500">
                  Search and manage registered patients
                </p>
              </div>

            </div>

        

          </div>
        </div>
      </header>

      <main className="p-4 lg:p-7 max-w-[1500px] mx-auto">

        {/* =================================================
            WELCOME / HERO
        ================================================= */}

        <section className="relative overflow-hidden bg-gradient-to-r from-[#e9f4ff] via-[#edf7ff] to-[#e1f1ff] rounded-2xl border border-blue-100 p-6 lg:p-7 mb-6">

          <div className="relative z-10 max-w-2xl">

            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
              <Users
                size={14}
              />

              PATIENT MANAGEMENT
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold mt-3">
              Find the right patient quickly
            </h2>

            <p className="text-slate-500 mt-2 text-sm lg:text-base">
              Search patients by name, email,
              phone number or patient information.
            </p>

          </div>

          <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:flex">

            <div className="w-40 h-40 rounded-full bg-blue-100 flex items-center justify-center">

              <div className="w-24 h-24 rounded-2xl bg-white shadow-md flex items-center justify-center">

                <Users
                  size={48}
                  className="text-blue-600"
                />

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          <InfoCard
            icon={
              <Users
                size={24}
              />
            }
            value={
              hasSearched
                ? patients.length
                : "—"
            }
            title="Search Results"
            subtitle={
              hasSearched
                ? "Patients found"
                : "Search to view"
            }
            color="blue"
          />

          <InfoCard
            icon={
              <UserRound
                size={24}
              />
            }
            value={
              hasSearched
                ? patients.filter(
                    (p) =>
                      p.gender
                        ?.toUpperCase() ===
                      "MALE"
                  ).length
                : "—"
            }
            title="Male Patients"
            subtitle="From current results"
            color="indigo"
          />

          <InfoCard
            icon={
              <UserRound
                size={24}
              />
            }
            value={
              hasSearched
                ? patients.filter(
                    (p) =>
                      p.gender
                        ?.toUpperCase() ===
                      "FEMALE"
                  ).length
                : "—"
            }
            title="Female Patients"
            subtitle="From current results"
            color="purple"
          />

          <InfoCard
            icon={
              <ClipboardList
                size={24}
              />
            }
            value={
              hasSearched
                ? patients.filter(
                    (p) =>
                      p.dateOfBirth
                  ).length
                : "—"
            }
            title="Complete Profiles"
            subtitle="DOB information available"
            color="green"
          />

        </div>

        {/* =================================================
            SEARCH PANEL
        ================================================= */}

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 lg:p-6 mb-6">

          <div className="flex flex-col lg:flex-row lg:items-end gap-4">

            <div className="flex-1">

              <label className="block text-sm font-semibold mb-2">
                Search Patient
              </label>

              <div className="relative">

                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  onKeyDown={
                    handleSearchKeyDown
                  }
                  placeholder="Search by patient name, phone or email..."
                  className="w-full h-12 pl-12 pr-11 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition"
                />

                {search && (
                  <button
                    onClick={
                      clearSearch
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X
                      size={18}
                    />
                  </button>
                )}

              </div>

              <p className="text-xs text-slate-400 mt-2">
                eg: Rahul, 987654XXXX,
                or rahul@gmail.com
              </p>

            </div>

            <button
              onClick={() =>
                searchPatients()
              }
              disabled={
                loading ||
                !search.trim()
              }
              className="h-12 px-7 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <RefreshCw
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Search
                  size={18}
                />
              )}

              Search Patients
            </button>

          </div>

        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 flex items-center justify-between">

            <span className="text-sm">
              {error}
            </span>

            <button
              onClick={() =>
                setError("")
              }
            >
              <X
                size={18}
              />
            </button>

          </div>
        )}

        {/* =================================================
            RESULTS
        ================================================= */}

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* TABLE HEADER */}

          <div className="px-5 lg:px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>
              <h2 className="text-lg font-bold">
                Patient Records
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                {hasSearched
                  ? `${patients.length} patient${
                      patients.length !== 1
                        ? "s"
                        : ""
                    } found`
                  : "Search for a patient to display records"}
              </p>
            </div>

            <div className="flex items-center gap-2">

              {hasSearched && (
                <button
                  onClick={refresh}
                  className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50"
                  title="Refresh"
                >
                  <RefreshCw
                    size={17}
                  />
                </button>
              )}

              <button
                onClick={() =>
                  navigate(
                    "/receptionist/patients/add"
                  )
                }
                className="sm:hidden flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-semibold"
              >
                <Plus
                  size={16}
                />

                Add Patient
              </button>

            </div>

          </div>

          {/* LOADING */}

          {loading && (
            <div className="py-16 text-center">

              <RefreshCw
                size={30}
                className="animate-spin mx-auto text-blue-600 mb-3"
              />

              <p className="text-sm text-slate-500">
                Searching patient records...
              </p>

            </div>
          )}

          {/* EMPTY INITIAL STATE */}

          {!loading &&
            !hasSearched && (
              <div className="py-20 px-5 text-center">

                <div className="w-20 h-20 rounded-full bg-blue-50 mx-auto flex items-center justify-center mb-5">

                  <Search
                    size={34}
                    className="text-blue-500"
                  />

                </div>

                <h3 className="text-lg font-bold">
                  Search Patient Records
                </h3>

                <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">
                  Enter a patient's name,
                  phone number or email above
                  to find their hospital record.
                </p>

                <button
                  onClick={() =>
                    navigate(
                      "/receptionist/patients/add"
                    )
                  }
                  className="mt-5 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
                >
                  <UserPlus
                    size={17}
                  />

                  Register New Patient
                </button>

              </div>
            )}

          {/* NO RESULTS */}

          {!loading &&
            hasSearched &&
            patients.length === 0 && (
              <div className="py-20 text-center px-5">

                <div className="w-20 h-20 rounded-full bg-orange-50 mx-auto flex items-center justify-center mb-5">

                  <Users
                    size={34}
                    className="text-orange-500"
                  />

                </div>

                <h3 className="text-lg font-bold">
                  No Patient Found
                </h3>

                <p className="text-sm text-slate-400 mt-2">
                  No patient matches{" "}
                  <span className="font-semibold text-slate-600">
                    "{search}"
                  </span>
                </p>

                <button
                  onClick={() =>
                    navigate(
                      "/receptionist/patients/add"
                    )
                  }
                  className="mt-5 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
                >
                  <UserPlus
                    size={17}
                  />

                  Register This Patient
                </button>

              </div>
            )}

          {/* DESKTOP TABLE */}

          {!loading &&
            patients.length > 0 && (
              <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                  <thead>

                    <tr className="bg-[#f4f8fc] text-left">

                      <th className="px-6 py-4 text-xs font-bold text-slate-500">
                        PATIENT
                      </th>

                      <th className="px-6 py-4 text-xs font-bold text-slate-500">
                        CONTACT
                      </th>

                      <th className="px-6 py-4 text-xs font-bold text-slate-500">
                        AGE / GENDER
                      </th>

                      <th className="px-6 py-4 text-xs font-bold text-slate-500">
                        DATE OF BIRTH
                      </th>

                      <th className="px-6 py-4 text-xs font-bold text-slate-500 text-right">
                        ACTIONS
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {patients.map(
                      (patient) => (
                        <tr
                          key={
                            patient.id
                          }
                          className="border-t border-slate-100 hover:bg-blue-50/40 transition"
                        >

                          {/* PATIENT */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 flex items-center justify-center font-bold">
                                {(
                                  patient.name ||
                                  "P"
                                )
                                  .charAt(
                                    0
                                  )
                                  .toUpperCase()}
                              </div>

                              <div>

                                <p className="font-bold text-sm">
                                  {
                                    patient.name
                                  }
                                </p>

                                <p className="text-xs text-slate-400 mt-0.5">
                                  Patient ID:{" "}
                                  <span className="font-medium text-slate-500">
                                    P-
                                    {String(
                                      patient.id
                                    ).padStart(
                                      5,
                                      "0"
                                    )}
                                  </span>
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* CONTACT */}

                          <td className="px-6 py-4">

                            <div className="space-y-1.5">

                              <div className="flex items-center gap-2 text-xs text-slate-600">
                                <Phone
                                  size={14}
                                  className="text-blue-500"
                                />

                                {
                                  patient.phoneNumber ||
                                  "Not available"
                                }
                              </div>

                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Mail
                                  size={14}
                                  className="text-slate-400"
                                />

                                <span className="max-w-[220px] truncate">
                                  {
                                    patient.email ||
                                    "Not available"
                                  }
                                </span>
                              </div>

                            </div>

                          </td>

                          {/* AGE / GENDER */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-2">

                              <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-semibold">
                                {calculateAge(
                                  patient.dateOfBirth
                                )}{" "}
                                yrs
                              </span>

                              <span className="text-xs text-slate-500">
                                {patient.gender ||
                                  "-"}
                              </span>

                            </div>

                          </td>

                          {/* DOB */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-2 text-sm text-slate-600">

                              <CalendarDays
                                size={16}
                                className="text-blue-500"
                              />

                              {formatDate(
                                patient.dateOfBirth
                              )}

                            </div>

                          </td>

                          {/* ACTIONS */}

                          <td className="px-6 py-4">

                            <div className="flex justify-end gap-2">

                              <button
                                onClick={() =>
                                  viewPatient(
                                    patient
                                  )
                                }
                                className="flex items-center gap-1.5 border border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-xs font-semibold"
                              >
                                <Eye
                                  size={15}
                                />

                                View
                              </button>

                              <button
                                onClick={() =>
                                  bookAppointment(
                                    patient
                                  )
                                }
                                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-semibold"
                              >
                                <CalendarDays
                                  size={15}
                                />

                                Book
                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          {/* FOOTER */}

          {patients.length > 0 && (
            <div className="px-5 lg:px-6 py-4 border-t border-slate-100 flex items-center justify-between">

              <p className="text-xs text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-600">
                  {patients.length}
                </span>{" "}
                result
                {patients.length !== 1
                  ? "s"
                  : ""}
              </p>

              <div className="flex items-center gap-2">

                <button
                  disabled
                  className="w-9 h-9 border border-slate-200 rounded-lg flex items-center justify-center text-slate-300"
                >
                  <ChevronLeft
                    size={16}
                  />
                </button>

                <span className="w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xs font-semibold">
                  1
                </span>

                <button
                  disabled
                  className="w-9 h-9 border border-slate-200 rounded-lg flex items-center justify-center text-slate-300"
                >
                  <ChevronRight
                    size={16}
                  />
                </button>

              </div>

            </div>
          )}

        </section>

        {/* =================================================
            BOTTOM QUICK ACTIONS
        ================================================= */}

        <div className="grid md:grid-cols-3 gap-4 mt-6">

          <QuickCard
            icon={
              <UserPlus
                size={23}
              />
            }
            title="Register New Patient"
            description="Create a new patient record"
            color="blue"
            onClick={() =>
              navigate(
                "/receptionist/patients/add"
              )
            }
          />

          <QuickCard
            icon={
              <CalendarDays
                size={23}
              />
            }
            title="Book Appointment"
            description="Schedule an appointment for a patient"
            color="green"
            onClick={() =>
              navigate(
                "/receptionist/appointments/book"
              )
            }
          />

          <QuickCard
            icon={
              <ClockIcon />
            }
            title="Available Doctor Slots"
            description="Check doctors and available timings"
            color="purple"
            onClick={() =>
              navigate(
                "/receptionist/doctor-slots"
              )
            }
          />

        </div>

      </main>

      {/* =================================================
          MOBILE BOTTOM BUTTON
      ================================================= */}

      <button
        onClick={() =>
          navigate(
            "/receptionist/patients/add"
          )
        }
        className="sm:hidden fixed bottom-5 right-5 w-14 h-14 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center z-40"
      >
        <Plus
          size={25}
        />
      </button>
    </div>
  );
}

// =======================================================
// INFO CARD
// =======================================================

function InfoCard({
  icon,
  value,
  title,
  subtitle,
  color,
}) {
  const colors = {
    blue:
      "bg-blue-50 text-blue-600",
    indigo:
      "bg-indigo-50 text-indigo-600",
    purple:
      "bg-purple-50 text-purple-600",
    green:
      "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 lg:p-5 shadow-sm">

      <div className="flex items-center gap-3">

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}
        >
          {icon}
        </div>

        <div className="min-w-0">

          <p className="text-2xl font-bold">
            {value}
          </p>

          <p className="text-xs font-semibold text-slate-600 truncate">
            {title}
          </p>

        </div>

      </div>

      <p className="text-[11px] text-slate-400 mt-3">
        {subtitle}
      </p>

    </div>
  );
}

// =======================================================
// QUICK CARD
// =======================================================

function QuickCard({
  icon,
  title,
  description,
  color,
  onClick,
}) {
  const colors = {
    blue:
      "bg-blue-50 text-blue-600",
    green:
      "bg-emerald-50 text-emerald-600",
    purple:
      "bg-purple-50 text-purple-600",
  };

  return (
    <button
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition flex items-center gap-4"
    >

      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}
      >
        {icon}
      </div>

      <div>

        <h3 className="font-bold text-sm">
          {title}
        </h3>

        <p className="text-xs text-slate-400 mt-1">
          {description}
        </p>

      </div>

    </button>
  );
}

// =======================================================
// CLOCK ICON
// =======================================================

function ClockIcon() {
  return (
    <CalendarDays
      size={23}
    />
  );
}