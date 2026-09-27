import { useEffect, useState } from "react";
import { Stethoscope } from "lucide-react";
import {
  CalendarDays,
  FileText,
  FlaskConical,
  ClipboardList,
  Search,
  UserRound,
  LockKeyhole,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import patientService from "../../services/patientService";
import doctorService from "../../services/doctorService";
import authService from "../../services/authService";
import { getRefreshToken } from "../../utils/tokenUtils";

function PatientDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [labOrders, setLabOrders] = useState([]);
  const [imaging, setImaging] = useState([]);

  const [activePage, setActivePage] = useState("dashboard");

  const [loading, setLoading] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);

  // SEARCH
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [showSearchResults, setShowSearchResults] =
    useState(false);

  // ALL DOCTORS
  const [allDoctors, setAllDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorsError, setDoctorsError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [
        profileData,
        appointmentData,
        reportData,
        labOrderData,
        imagingData,
      ] = await Promise.all([
        patientService.getProfile(),
        patientService.getAppointments(),
        patientService.getReports(),
        patientService.getLabOrders(),
        patientService.getImaging(),
      ]);

      setProfile(profileData);
      setAppointments(appointmentData || []);
      setReports(reportData || []);
      setLabOrders(labOrderData || []);
      setImaging(imagingData || []);
    } catch (error) {
      console.error(
        "Patient dashboard error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DOCTOR SEARCH
  // =========================

  const searchDoctors = async () => {
    const specialization = searchText.trim();

    if (!specialization) {
      setSearchResults([]);
      setShowSearchResults(false);
      setSearchError("");
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError("");
      setShowSearchResults(true);

      const data =
        await doctorService.getDoctors(
          specialization
        );

      console.log(
        "Doctor search response:",
        data
      );

      if (Array.isArray(data)) {
        setSearchResults(data);
      } else if (Array.isArray(data?.doctors)) {
        setSearchResults(data.doctors);
      } else if (Array.isArray(data?.data)) {
        setSearchResults(data.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error(
        "Doctor search error:",
        error
      );

      setSearchResults([]);

      setSearchError(
        error.response?.data?.message ||
          error.message ||
          "Unable to search doctors."
      );
    } finally {
      setSearchLoading(false);
    }
  };

  // =========================
  // ALL DOCTORS
  // =========================

  const loadAllDoctors = async () => {
    try {
      setDoctorsLoading(true);
      setDoctorsError("");

      const data = await doctorService.getDoctors("");

      console.log("All doctors response:", data);

      if (Array.isArray(data)) {
        setAllDoctors(data);
      } else if (Array.isArray(data?.doctors)) {
        setAllDoctors(data.doctors);
      } else if (Array.isArray(data?.data)) {
        setAllDoctors(data.data);
      } else {
        setAllDoctors([]);
      }
    } catch (error) {
      console.error("All doctors error:", error);
      setAllDoctors([]);
      setDoctorsError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load doctors."
      );
    } finally {
      setDoctorsLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = async () => {
    try {
      await authService.logout(
        getRefreshToken()
      );
    } finally {
      window.location.href = "/patient/login";
    }
  };

  // =========================
  // SIDEBAR
  // =========================

  const menu = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "appointments",
      label: "My Appointments",
      icon: CalendarDays,
    },
    {
      id: "reports",
      label: "Medical Reports",
      icon: FileText,
    },
    {
      id: "labs",
      label: "Lab Tests",
      icon: FlaskConical,
    },
    {
      id: "lab-orders",
      label: "Lab Orders",
      icon: ClipboardList,
    },
    {
      id: "profile",
      label: "Profile",
      icon: UserRound,
    },
    {
      id: "password",
      label: "Change Password",
      icon: LockKeyhole,
    },

    {
  id: "doctors",
  label: "All Doctors",
  icon: Stethoscope,
    }

  ];

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f8ff]">
        <Loader2
          size={40}
          className="animate-spin text-blue-600"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f8ff]">

      {/* MOBILE OVERLAY */}
      {mobileMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0d1f3c] text-white transition-transform duration-300 lg:translate-x-0 ${
          mobileMenu
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">

          {/* LOGO */}

          <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500">
                <span className="text-xl font-bold">
                  +
                </span>
              </div>

              <div>
                <h1 className="text-xl font-bold">
                  MediCare
                </h1>

                <p className="text-[10px] text-blue-200">
                  Hospital Management
                </p>
              </div>

            </div>

            <button
              className="lg:hidden"
              onClick={() =>
                setMobileMenu(false)
              }
            >
              <X size={22} />
            </button>

          </div>

          {/* MENU */}

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">

            {menu.map((item) => {
              const Icon = item.icon;

              const active =
                activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setMobileMenu(false);

                    if (item.id === "doctors") {
                      loadAllDoctors();
                    }
                  }}
                  className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm transition ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                      : "text-blue-100 hover:bg-white/10"
                  }`}
                >
                  <Icon size={20} />

                  <span>{item.label}</span>

                  {active && (
                    <ChevronRight
                      size={16}
                      className="ml-auto"
                    />
                  )}
                </button>
              );
            })}

          </nav>

          {/* LOGOUT */}

          <div className="border-t border-white/10 p-4">

            <button
              onClick={logout}
              className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10"
            >
              <LogOut size={20} />

              Logout
            </button>

          </div>

        </div>
      </aside>

      {/* =========================
          MAIN
      ========================= */}

      <div className="lg:pl-64">

        {/* =========================
            TOPBAR
        ========================= */}

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur md:px-8">

          {/* MOBILE MENU */}

          <button
            className="rounded-lg p-2 text-slate-600 lg:hidden"
            onClick={() =>
              setMobileMenu(true)
            }
          >
            <Menu size={24} />
          </button>

          {/* =========================
              SEARCH
          ========================= */}

          <div className="relative hidden w-full max-w-md md:block">

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 focus-within:border-blue-500 focus-within:bg-white">

              <Search
                size={18}
                className="shrink-0 text-slate-400"
              />

              <input
                type="text"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setShowSearchResults(false);
                  setSearchError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchDoctors();
                  }
                }}
                placeholder="Search specialization..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />

              <button
                type="button"
                onClick={searchDoctors}
                disabled={searchLoading}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {searchLoading
                  ? "..."
                  : "Search"}
              </button>

            </div>

            {/* SEARCH RESULTS */}

            {showSearchResults && (
              <div className="absolute left-0 right-0 top-14 z-50 max-h-96 overflow-y-auto overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

                {searchLoading && (
                  <div className="p-5 text-center text-sm text-slate-500">
                    Searching doctors...
                  </div>
                )}

                {!searchLoading &&
                  searchError && (
                    <div className="p-5 text-center text-sm text-red-500">
                      {searchError}
                    </div>
                  )}

                {!searchLoading &&
                  !searchError &&
                  searchResults.length === 0 && (
                    <div className="p-5 text-center text-sm text-slate-500">
                      No doctors found for "
                      {searchText}".
                    </div>
                  )}

                {!searchLoading &&
                  !searchError &&
                  searchResults.map((doctor) => {

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
                      <button
                        key={doctorId}
                        type="button"
                        disabled={!doctorId}
                        onClick={() => {
                          if (!doctorId) return;

                          setShowSearchResults(false);

                          navigate(
                            `/doctors/${doctorId}`
                          );
                        }}
                        className="flex w-full items-center gap-4 border-b border-slate-100 px-4 py-3 text-left last:border-0 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <UserRound size={19} />
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-sm font-bold text-slate-800">
                            {name}
                          </p>

                          <p className="text-xs text-blue-600">
                            {specialization}
                          </p>

                          {experience != null && (
                            <p className="text-xs text-slate-400">
                              {experience}+
                              years experience
                            </p>
                          )}

                        </div>

                        <ChevronRight
                          size={17}
                          className="text-slate-400"
                        />

                      </button>
                    );
                  })}

              </div>
            )}

          </div>

          {/* PATIENT */}

          <div className="ml-auto flex items-center gap-3">

            <div className="hidden text-right sm:block">

              <p className="text-sm font-bold text-slate-800">
                {profile?.name || "Patient"}
              </p>

              <p className="text-xs text-slate-500">
                Patient
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <UserRound size={22} />
            </div>

          </div>

        </header>

        {/* =========================
            CONTENT
        ========================= */}

        <main className="p-5 md:p-8">

          {/* DASHBOARD */}

          {activePage === "dashboard" && (
            <DashboardHome
              profile={profile}
              appointments={appointments}
              reports={reports}
              labOrders={labOrders}
              imaging={imaging}
              setActivePage={setActivePage}
            />
          )}

          {/* APPOINTMENTS */}

          {activePage === "appointments" && (
            <Appointments
              appointments={appointments}
              reload={loadDashboard}
            />
          )}

          {/* REPORTS */}

          {activePage === "reports" && (
            <Reports reports={reports} />
          )}

          {/* LAB ORDERS */}

          {activePage === "lab-orders" && (
            <LabOrders orders={labOrders} />
          )}

          {/* PROFILE */}

          {activePage === "profile" && (
            <Profile profile={profile} />
          )}

          {/* LAB TESTS */}

          {activePage === "labs" && (
            <LabTests />
          )}

          {/* PASSWORD */}

          {activePage === "password" && (
            <ChangePassword />
          )}

          {/* ALL DOCTORS */}

          {activePage === "doctors" && (
            <AllDoctors
              doctors={allDoctors}
              loading={doctorsLoading}
              error={doctorsError}
            />
          )}

        </main>

      </div>

    </div>
  );
}

/* =====================================================
   DASHBOARD
===================================================== */

function DashboardHome({
  profile,
  appointments,
  reports,
  labOrders,
  imaging,
  setActivePage,
}) {
  const upcoming = appointments.filter(
    (a) =>
      a.status !== "CANCELLED" &&
      a.status !== "COMPLETED"
  );

  return (
    <div className="mx-auto max-w-7xl">

      {/* WELCOME */}

      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 p-7 text-white shadow-lg">

        <p className="text-sm text-blue-100">
          Patient Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Welcome Back,{" "}
          {profile?.name || "Patient"}!
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
          Take control of your health. Manage
          appointments, medical reports and your
          healthcare records from one place.
        </p>

      </div>

      {/* STATS */}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          icon={CalendarDays}
          value={upcoming.length}
          label="Appointments"
          color="green"
        />

        <StatCard
          icon={FileText}
          value={reports.length}
          label="Medical Reports"
          color="blue"
        />

        <StatCard
          icon={FlaskConical}
          value={labOrders.length}
          label="Lab Orders"
          color="orange"
        />

        <StatCard
          icon={ClipboardList}
          value={imaging.length}
          label="Imaging Records"
          color="red"
        />

      </div>

      {/* APPOINTMENTS + QUICK ACTIONS */}

      <div className="mt-6 grid gap-6 xl:grid-cols-2">

        <Panel
          title="Upcoming Appointments"
          action={() =>
            setActivePage("appointments")
          }
        >

          {upcoming.length === 0 ? (
            <Empty text="No upcoming appointments." />
          ) : (
            upcoming
              .slice(0, 4)
              .map((appointment) => (
                <div
                  key={appointment.appointmentId}
                  className="flex items-center gap-4 border-b border-slate-100 py-4 last:border-0"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <CalendarDays size={20} />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="font-semibold text-slate-800">
                      Dr.{" "}
                      {appointment.doctorName}
                    </p>

                    <p className="text-xs text-slate-500">
                      {appointment.appointmentDate}
                      {" · "}
                      {appointment.appointmentTime}
                    </p>

                  </div>

                  <Status
                    status={appointment.status}
                  />

                </div>
              ))
          )}

        </Panel>

        <Panel title="Quick Actions">

          <div className="grid grid-cols-2 gap-4">

            <QuickAction
              icon={CalendarDays}
              title="My Appointments"
              onClick={() =>
                setActivePage(
                  "appointments"
                )
              }
            />

            <QuickAction
              icon={FileText}
              title="View Reports"
              onClick={() =>
                setActivePage("reports")
              }
            />

            <QuickAction
              icon={FlaskConical}
              title="Lab Tests"
              onClick={() =>
                setActivePage("labs")
              }
            />

            <QuickAction
              icon={ClipboardList}
              title="Lab Orders"
              onClick={() =>
                setActivePage(
                  "lab-orders"
                )
              }
            />

          </div>

        </Panel>

      </div>

      {/* REPORTS + LAB */}

      <div className="mt-6 grid gap-6 xl:grid-cols-2">

        {/* REPORTS */}

        <Panel
          title="Recent Medical Reports"
          action={() =>
            setActivePage("reports")
          }
        >

          {reports.length === 0 ? (
            <Empty text="No medical reports found." />
          ) : (
            reports
              .slice(0, 4)
              .map((report) => (
                <div
                  key={report.id}
                  className="flex items-center gap-4 border-b border-slate-100 py-4 last:border-0"
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FileText size={19} />
                  </div>

                  <div>

                    <p className="font-semibold text-slate-800">
                      {report.diagnosis ||
                        "Medical Report"}
                    </p>

                    <p className="text-xs text-slate-500">
                      {report.createdAt
                        ? new Date(
                            report.createdAt
                          ).toLocaleDateString()
                        : "Medical record"}
                    </p>

                  </div>

                </div>
              ))
          )}

        </Panel>

        {/* LAB ORDERS */}

        <Panel
          title="Recent Lab Orders"
          action={() =>
            setActivePage(
              "lab-orders"
            )
          }
        >

          {labOrders.length === 0 ? (
            <Empty text="No lab orders found." />
          ) : (
            labOrders
              .slice(0, 4)
              .map((order) => (
                <div
                  key={order.orderId}
                  className="flex items-center gap-4 border-b border-slate-100 py-4 last:border-0"
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                    <FlaskConical size={19} />
                  </div>

                  <div className="flex-1">

                    <p className="font-semibold text-slate-800">
                      {order.testName}
                    </p>

                    <p className="text-xs text-slate-500">
                      {order.status}
                    </p>

                  </div>

                  <Status
                    status={order.status}
                  />

                </div>
              ))
          )}

        </Panel>

      </div>

    </div>
  );
}

/* =====================================================
   APPOINTMENTS
===================================================== */

function Appointments({
  appointments,
  reload,
}) {
  const [cancelling, setCancelling] =
    useState(null);

  const cancel = async (id) => {
    if (
      !window.confirm(
        "Cancel this appointment?"
      )
    ) {
      return;
    }

    try {
      setCancelling(id);

      await patientService.cancelAppointment(
        id
      );

      await reload();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to cancel appointment."
      );
    } finally {
      setCancelling(null);
    }
  };

  return (
    <PageTitle
      title="My Appointments"
      subtitle="View and manage your appointments"
    >

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

        {appointments.length === 0 ? (
          <Empty text="No appointments found." />
        ) : (
          appointments.map(
            (appointment) => (
              <div
                key={
                  appointment.appointmentId
                }
                className="flex flex-col gap-4 border-b border-slate-100 p-5 last:border-0 md:flex-row md:items-center"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <CalendarDays size={22} />
                </div>

                <div className="flex-1">

                  <h3 className="font-bold text-slate-800">
                    Dr.{" "}
                    {appointment.doctorName}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {
                      appointment.appointmentDate
                    }
                    {" · "}
                    {
                      appointment.appointmentTime
                    }
                  </p>

                </div>

                <Status
                  status={appointment.status}
                />

                {appointment.status ===
                  "BOOKED" && (
                  <button
                    onClick={() =>
                      cancel(
                        appointment.appointmentId
                      )
                    }
                    disabled={
                      cancelling ===
                      appointment.appointmentId
                    }
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
                  >
                    {cancelling ===
                    appointment.appointmentId
                      ? "Cancelling..."
                      : "Cancel"}
                  </button>
                )}

              </div>
            )
          )
        )}

      </div>

    </PageTitle>
  );
}

/* =====================================================
   REPORTS
===================================================== */

function Reports({ reports }) {
  return (
    <PageTitle
      title="Medical Reports"
      subtitle="Your medical history and reports"
    >

      <div className="grid gap-5 md:grid-cols-2">

        {reports.length === 0 ? (
          <Empty text="No medical reports found." />
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FileText size={22} />
                </div>

                <div>

                  <h3 className="font-bold text-slate-800">
                    {report.diagnosis ||
                      "Medical Report"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Dr.{" "}
                    {report.doctorName ||
                      "Doctor"}
                  </p>

                </div>

              </div>

              <div className="mt-5 space-y-3 text-sm">

                <Info
                  label="Symptoms"
                  value={report.symptoms}
                />

                <Info
                  label="Treatment"
                  value={report.treatment}
                />

                <Info
                  label="Prescription"
                  value={report.prescription}
                />

                <Info
                  label="Notes"
                  value={report.notes}
                />

              </div>

            </div>
          ))
        )}

      </div>

    </PageTitle>
  );
}

/* =====================================================
   LAB TESTS
===================================================== */

function LabTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    patientService
      .getAvailableLabTests()
      .then((data) => {
        setTests(
          Array.isArray(data)
            ? data
            : data?.data || []
        );
      })
      .catch(console.error)
      .finally(() =>
        setLoading(false)
      );

  }, []);

  return (
    <PageTitle
      title="Lab Tests"
      subtitle="Available laboratory tests"
    >

      {loading ? (
        <Loader2 className="animate-spin text-blue-600" />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {tests.length === 0 ? (
            <Empty text="No active lab tests." />
          ) : (
            tests.map((test) => (
              <div
                key={test.id}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <FlaskConical size={22} />
                </div>

                <h3 className="mt-4 font-bold text-slate-800">
                  {test.name}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {test.description}
                </p>

                <div className="mt-4 flex justify-between text-sm">

                  <span className="text-slate-500">
                    {test.sampleType}
                  </span>

                  <span className="font-bold text-blue-600">
                    ₹{test.price}
                  </span>

                </div>

              </div>
            ))
          )}

        </div>
      )}

    </PageTitle>
  );
}

/* =====================================================
   LAB ORDERS
===================================================== */

function LabOrders({ orders }) {
  return (
    <PageTitle
      title="Lab Orders"
      subtitle="Your laboratory orders and results"
    >

      <div className="rounded-2xl border border-slate-200 bg-white">

        {orders.length === 0 ? (
          <Empty text="No lab orders found." />
        ) : (
          orders.map((order) => (
            <div
              key={order.orderId}
              className="flex flex-col gap-4 border-b border-slate-100 p-5 last:border-0 md:flex-row md:items-center"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <FlaskConical size={22} />
              </div>

              <div className="flex-1">

                <h3 className="font-bold text-slate-800">
                  {order.testName}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {order.sampleType}

                  {order.scheduledDate
                    ? ` · ${order.scheduledDate}`
                    : ""}
                </p>

              </div>

              <Status
                status={order.status}
              />

            </div>
          ))
        )}

      </div>

    </PageTitle>
  );
}

/* =====================================================
   PROFILE
===================================================== */

function Profile({ profile }) {
  return (
    <PageTitle
      title="My Profile"
      subtitle="Your patient information"
    >

      <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-7">

        <div className="flex items-center gap-5 border-b border-slate-100 pb-6">

          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <UserRound size={36} />
          </div>

          <div>

            <h2 className="text-2xl font-bold text-slate-800">
              {profile?.name}
            </h2>

            <p className="text-sm text-slate-500">
              Patient
            </p>

          </div>

        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">

          <Info
            label="Email"
            value={profile?.email}
          />

          <Info
            label="Phone Number"
            value={profile?.phoneNumber}
          />

          <Info
            label="Date of Birth"
            value={profile?.dateOfBirth}
          />

          <Info
            label="Gender"
            value={profile?.gender}
          />

        </div>

      </div>

    </PageTitle>
  );
}

/* =====================================================
   CHANGE PASSWORD
===================================================== */

function ChangePassword() {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await authService.changePassword({
        currentPassword,
        newPassword,
      });

      alert(
        "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTitle
      title="Change Password"
      subtitle="Keep your account secure"
    >

      <form
        onSubmit={submit}
        className="max-w-lg rounded-2xl border border-slate-200 bg-white p-7"
      >

        <input
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) =>
            setCurrentPassword(
              e.target.value
            )
          }
          className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          required
        />

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(
              e.target.value
            )
          }
          className="mb-5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          required
        />

        <button
          disabled={loading}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "Changing..."
            : "Change Password"}
        </button>

      </form>

    </PageTitle>
  );
}

/* =====================================================
   ALL DOCTORS
===================================================== */

function AllDoctors({
  doctors,
  loading,
  error,
}) {
  const navigate = useNavigate();

  return (
    <PageTitle
      title="All Doctors"
      subtitle="Find a doctor and book an appointment"
    >
      {loading && (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={36}
              className="animate-spin text-blue-600"
            />
            <p className="text-sm text-slate-500">
              Loading doctors...
            </p>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-600">
            Unable to load doctors
          </p>
          <p className="mt-1 text-sm text-red-500">
            {error}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && doctors.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Stethoscope size={30} />
          </div>
          <h3 className="mt-4 font-semibold text-slate-800">
            No doctors found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            There are currently no doctors available.
          </p>
        </div>
      )}

      {!loading && !error && doctors.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {doctors.map((doctor) => {
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
              <div
                key={doctorId}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20">
                      <Stethoscope size={30} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold">
                        Dr. {name}
                      </h3>
                      <p className="mt-1 text-sm text-blue-100">
                        {specialization}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-500">
                        Specialization
                      </span>
                      <span className="text-right text-sm font-semibold text-slate-800">
                        {specialization}
                      </span>
                    </div>

                    {experience != null && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                          Experience
                        </span>
                        <span className="text-sm font-semibold text-slate-800">
                          {experience} years
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={!doctorId}
                    onClick={() => {
                      if (!doctorId) return;
                      navigate(`/doctors/${doctorId}`);
                    }}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    View Doctor
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageTitle>
  );
}

/* =====================================================
   UI COMPONENTS
===================================================== */

function StatCard({
  icon: Icon,
  value,
  label,
  color,
}) {
  const colors = {
    green:
      "bg-green-50 text-green-600",
    blue:
      "bg-blue-50 text-blue-600",
    orange:
      "bg-orange-50 text-orange-500",
    red:
      "bg-red-50 text-red-500",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <div className="flex items-center gap-4">

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[color]}`}
        >
          <Icon size={22} />
        </div>

        <div>

          <p className="text-2xl font-bold text-slate-800">
            {value}
          </p>

          <p className="text-xs text-slate-500">
            {label}
          </p>

        </div>

      </div>

    </div>
  );
}

function Panel({
  title,
  action,
  children,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <div className="mb-2 flex items-center justify-between">

        <h2 className="font-bold text-slate-800">
          {title}
        </h2>

        {action && (
          <button
            onClick={action}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            View All
          </button>
        )}

      </div>

      {children}

    </div>
  );
}

function QuickAction({
  icon: Icon,
  title,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-slate-100 bg-slate-50 p-5 text-left transition hover:border-blue-200 hover:bg-blue-50"
    >

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
        <Icon size={21} />
      </div>

      <p className="mt-3 text-sm font-semibold text-slate-800">
        {title}
      </p>

    </button>
  );
}

function PageTitle({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="mx-auto max-w-7xl">

      <div className="mb-6">

        <h1 className="text-2xl font-bold text-slate-900">
          {title}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {subtitle}
        </p>

      </div>

      {children}

    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm text-slate-700">
        {value || "Not available"}
      </p>

    </div>
  );
}

function Status({ status }) {
  const value = status || "UNKNOWN";

  let style =
    "bg-slate-100 text-slate-600";

  if (
    value === "BOOKED" ||
    value === "CONFIRMED" ||
    value === "COMPLETED"
  ) {
    style =
      "bg-green-50 text-green-600";
  }

  if (
    value === "PENDING" ||
    value === "PROCESSING"
  ) {
    style =
      "bg-yellow-50 text-yellow-600";
  }

  if (
    value === "CANCELLED" ||
    value === "FAILED"
  ) {
    style =
      "bg-red-50 text-red-600";
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}
    >
      {value}
    </span>
  );
}

function Empty({ text }) {
  return (
    <div className="py-10 text-center text-sm text-slate-400">
      {text}
    </div>
  );
}

export default PatientDashboard;