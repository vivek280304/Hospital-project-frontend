import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import doctorService from "../../services/doctorService";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  FlaskConical,
  HeartPulse,
  Home,
  Image,
  LogOut,
  Menu,
  Search,
  Settings,
  UserRound,
  Users,
  X,
} from "lucide-react";

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function DoctorDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [imagingOrders, setImagingOrders] = useState([]);
  const [sharedPatients, setSharedPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState("");
  const [scheduleDate, setScheduleDate] = useState(() => formatLocalDate(new Date()));
  const [searchQuery, setSearchQuery] = useState("");


  const today = formatLocalDate(new Date());

  const loadDashboard = async () => {
      try {
        setLoading(true);
        setDataError("");

        const results = await Promise.allSettled([
          doctorService.getProfile(),
          doctorService.getAppointments(scheduleDate),
          doctorService.getImagingOrders(),
          doctorService.getSharedPatients(),
        ]);

        const [profileResult, appointmentsResult, imagingResult, patientsResult] = results;

        if (profileResult.status === "fulfilled") {
          setProfile(profileResult.value);
        }

        if (appointmentsResult.status === "fulfilled") {
          setAppointments(Array.isArray(appointmentsResult.value) ? appointmentsResult.value : []);
        }

        if (imagingResult.status === "fulfilled") {
          setImagingOrders(Array.isArray(imagingResult.value) ? imagingResult.value : []);
        }

        if (patientsResult.status === "fulfilled") {
          setSharedPatients(Array.isArray(patientsResult.value) ? patientsResult.value : []);
        }

        if (results.every((result) => result.status === "rejected")) {
          setDataError("Unable to load doctor dashboard data.");
        }
      } catch (error) {
        console.error("Doctor dashboard error:", error);
        setDataError("Unable to load doctor dashboard data.");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadDashboard();
  }, [scheduleDate]);

  const bookedAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.status === "BOOKED"),
    [appointments]
  );

  const completedAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.status === "COMPLETED"),
    [appointments]
  );

  const filteredAppointments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return appointments;
    return appointments.filter((a) => [a.patientName, a.patientId, a.reason, a.appointmentTime].filter(Boolean).some((v) => String(v).toLowerCase().includes(q)));
  }, [appointments, searchQuery]);

  const doctorName =
    profile?.name ||
    profile?.doctorName ||
    "";

  const specialization =
    profile?.specialization ||
    "";

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    navigate("/", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* =====================================================
          MOBILE SIDEBAR OVERLAY
      ====================================================== */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-[#0d1b33] text-white transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >

        {/* Logo */}

        <div className="flex h-[76px] items-center border-b border-white/10 px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
              <HeartPulse size={27} />
            </div>

            <div>
              <h1 className="text-xl font-bold">
                MediCare
              </h1>

              <p className="text-[10px] tracking-wide text-slate-300">
                Hospital Management System
              </p>
            </div>

          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden"
          >
            <X size={22} />
          </button>

        </div>

        {/* Doctor */}

        <div className="border-b border-white/10 px-5 py-6">

          <div className="flex items-center gap-3">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-blue-700">
              <UserRound size={30} />
            </div>

            <div>
              <p className="font-semibold">
                {doctorName}
              </p>

              <p className="text-sm text-slate-300">
                {specialization}
              </p>

              <div className="mt-1 flex items-center gap-1.5">

                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                <span className="text-xs text-emerald-300">
                  Online
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Navigation */}

        <nav className="flex-1 space-y-1 px-3 py-5">

          <SidebarItem
            icon={<Home size={20} />}
            label="Dashboard"
            active
            onClick={() => navigate("/doctor/dashboard")}
          />

          <SidebarItem
            icon={<CalendarDays size={20} />}
            label="My Appointments"
            onClick={() => navigate("/doctor/appointments")}
          />

         <SidebarItem
  icon={<UserRound size={20} />}
  label="Patient Details"
  onClick={() => navigate("/doctor/patients")}
/>

          <SidebarItem
            icon={<FileText size={20} />}
            label="Medical Reports"
          />

          <SidebarItem
            icon={<Image size={20} />}
            label="Imaging Orders"
          />

          <SidebarItem
            icon={<CalendarDays size={20} />}
            label="My Schedule"
            onClick={() => document.getElementById("doctor-schedule")?.scrollIntoView({ behavior: "smooth" })}
          />

          <SidebarItem
            icon={<UserRound size={20} />}
            label="Profile"
          />

          <SidebarItem
            icon={<Settings size={20} />}
            label="Change Password"
          />

        </nav>

        {/* Logout */}

        <div className="border-t border-white/10 p-4">

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut size={21} />
            <span className="font-medium">
              Logout
            </span>
          </button>

        </div>

      </aside>

      {/* =====================================================
          MAIN AREA
      ====================================================== */}

      <div className="lg:ml-64">

        {/* ===================================================
            TOPBAR
        ==================================================== */}

        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">

          <button
            onClick={() => setSidebarOpen(true)}
            className="mr-4 rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={23} />
          </button>

          {/* Search */}

          <div className="relative hidden max-w-xl flex-1 md:block">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient by name or ID..."
              className="w-full rounded-xl bg-slate-100 py-3 pl-12 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* Right */}

          <div className="ml-auto flex items-center gap-5">

            <button className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100">

              <Bell size={22} />

              <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500" />

            </button>

            <div className="hidden h-8 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 text-blue-700">
                <UserRound size={25} />
              </div>

              <div className="hidden sm:block">

                <p className="text-sm font-bold text-slate-800">
                  Doctor
                </p>

                <p className="text-xs text-slate-500">
                  Medical Specialist
                </p>

              </div>

            </div>

          </div>

        </header>

        {/* ===================================================
            CONTENT
        ==================================================== */}

        <main className="p-4 sm:p-6">

          {dataError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {dataError}
            </div>
          )}

          {/* Welcome */}

          <section className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-6">

            <div className="relative z-10">

              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {doctorName ? `Welcome, ${doctorName}!` : "Doctor Dashboard"}
              </h2>

              <p className="mt-2 text-slate-600">
                {today} · Your schedule and appointment information
              </p>

            </div>

            <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-blue-100/60" />
            <div className="absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-cyan-100/50" />

          </section>

          {/* =================================================
              STATISTICS
          ================================================== */}

          <section className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              icon={<CalendarDays size={25} />}
              value={appointments.length}
              label="Today's Appointments"
              iconClass="bg-emerald-50 text-emerald-500"
            />

            <StatCard
              icon={<Users size={25} />}
              value={sharedPatients.length}
              label="Total Patients"
              iconClass="bg-blue-50 text-blue-500"
            />

            <StatCard
              icon={<FileText size={25} />}
              value={completedAppointments.length}
              label="Medical Reports"
              iconClass="bg-indigo-50 text-indigo-500"
            />

            <StatCard
              icon={<FlaskConical size={25} />}
              value={imagingOrders.length}
              label="Pending Lab Tests"
              iconClass="bg-orange-50 text-orange-500"
            />

          </section>

          {/* =================================================
              TWO COLUMN
          ================================================== */}

          <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_370px]">

            {/* LEFT */}

            <div className="space-y-5">

              {/* Today's Appointments */}

              <DashboardCard
                title="Today's Appointments"
                action="View All"
                onAction={() => navigate("/doctor/appointments")}
              >

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[700px]">

                    <thead>

                      <tr className="bg-slate-100 text-left text-xs font-semibold text-slate-600">

                        <th className="rounded-l-lg px-4 py-3">
                          Time
                        </th>

                        <th className="px-4 py-3">
                          Patient Name
                        </th>

                        <th className="px-4 py-3">
                          Age / Gender
                        </th>

                        <th className="px-4 py-3">
                          Reason
                        </th>

                        <th className="px-4 py-3">
                          Status
                        </th>

                        <th className="rounded-r-lg px-4 py-3">
                          Actions
                        </th>

                      </tr>

                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="py-12 text-center text-sm text-slate-400"
                          >
                            Loading appointments...
                          </td>
                        </tr>
                      ) : appointments.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="py-12 text-center text-sm text-slate-400"
                          >
                            No appointments for today.
                          </td>
                        </tr>
                      ) : (
                        filteredAppointments.slice(0, 5).map((appointment) => (
                          <tr
                            key={appointment.appointmentId}
                            className="border-t border-slate-100"
                          >
                            <td className="px-4 py-4 text-sm font-medium">
                              {appointment.appointmentTime || "—"}
                            </td>
                            <td className="px-4 py-4 text-sm font-medium">
                              {appointment.patientName || "—"}
                            </td>
                            <td className="px-4 py-4 text-sm text-slate-600">
                              {appointment.age ?? "—"} / {appointment.gender || "—"}
                            </td>
                            <td className="px-4 py-4 text-sm text-slate-600">
                              {appointment.reason || "—"}
                            </td>
                            <td className="px-4 py-4 text-sm">
                              {appointment.status || "—"}
                            </td>
                            <td className="px-4 py-4">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/doctor/appointments/${appointment.appointmentId}/patient`
                                  )
                                }
                                className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>

                  </table>

                </div>

              </DashboardCard>

              {/* Bottom Cards */}

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                <DashboardCard
                  title="Recent Medical Reports"
                  action="View All"
                >

                  <div className="py-4">
                    <p className="text-3xl font-bold text-slate-900">
                      {completedAppointments.length}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Completed appointments
                    </p>
                  </div>

                </DashboardCard>

                <DashboardCard
                  title="Pending Lab / Imaging Orders"
                  action="View All"
                >

                  <div className="py-4">
                    <p className="text-3xl font-bold text-slate-900">
                      {imagingOrders.length}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Imaging orders
                    </p>
                  </div>

                </DashboardCard>

              </div>

            </div>

            {/* RIGHT */}

            <div className="space-y-5">

              {/* Schedule */}

              <div id="doctor-schedule">
                <DashboardCard title="My Schedule">

                <div className="mb-4 flex items-center justify-between">

                  <button type="button" onClick={() => { const d = new Date(`${scheduleDate}T12:00:00`);
                    d.setDate(d.getDate() - 1);
                    setScheduleDate(formatLocalDate(d)); }} className="rounded-lg p-2 hover:bg-slate-100">
                    <ChevronLeft size={18} />
                  </button>

                  <p className="font-semibold text-slate-800 text-center">
                    {scheduleDate === today
                      ? "Today"
                      : new Date(`${scheduleDate}T12:00:00`).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                  </p>

                  <button type="button" onClick={() => { const d = new Date(`${scheduleDate}T12:00:00`);
                    d.setDate(d.getDate() + 1);
                    setScheduleDate(formatLocalDate(d)); }} className="rounded-lg p-2 hover:bg-slate-100">
                    <ChevronRight size={18} />
                  </button>

                </div>

                <div className="mb-3">
                  <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                </div>

                <div className="rounded-xl border border-slate-100 p-4">
                  <div className="mt-4 space-y-2">
                    {appointments.length === 0 ? (
                      <p className="py-4 text-center text-sm text-slate-400">
                        No appointments scheduled for this date.
                      </p>
                    ) : (
                      appointments.slice(0, 4).map((appointment) => (
                        <div
                          key={appointment.appointmentId}
                          className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                        >
                          <span className="text-sm font-medium text-slate-700">
                            {appointment.appointmentTime || "—"}
                          </span>
                          <span className="max-w-[150px] truncate text-sm text-slate-500">
                            {appointment.patientName || "—"}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </DashboardCard>

              </div>

              {/* Recent Patients */}

              <DashboardCard
                title="Recent Patients"
                action="View All"
              >

                {loading ? (
                  <p className="py-8 text-center text-sm text-slate-400">
                    Loading patients...
                  </p>
                ) : sharedPatients.length === 0 ? (
                  <EmptyState
                    icon={<Users size={25} />}
                    text="No patients available."
                  />
                ) : (
                  <div className="space-y-3">
                    {sharedPatients.slice(0, 5).map((patient, index) => (
                      <div
                        key={patient.id ?? patient.patientId ?? index}
                        className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <UserRound size={17} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {patient.name || patient.patientName || "—"}
                            </p>
                            <p className="text-xs text-slate-400">
                              {patient.id ?? patient.patientId ?? "—"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </DashboardCard>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}

/* ============================================================
   SIDEBAR ITEM
============================================================ */

function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
          : "text-slate-200 hover:bg-white/10"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  icon,
  value,
  label,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

      <div className="flex items-center gap-4">

        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <div>

          <p className="text-2xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {label}
          </p>

        </div>

      </div>

    </div>
  );
}

/* ============================================================
   DASHBOARD CARD
============================================================ */

function DashboardCard({
  title,
  action,
  onAction,
  children,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

      <div className="mb-5 flex items-center justify-between">

        <h3 className="text-lg font-bold text-slate-900">
          {title}
        </h3>

        {action && (
          <button
            type="button"
            onClick={onAction}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            {action}
          </button>
        )}

      </div>

      {children}

    </div>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({
  icon,
  text,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">

      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        {icon}
      </div>

      <p className="text-sm text-slate-400">
        {text}
      </p>

    </div>
  );
} 

export default DoctorDashboard;