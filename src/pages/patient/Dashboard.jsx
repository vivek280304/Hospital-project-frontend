import { useEffect, useState } from "react";

import {
  CalendarDays,
  FileText,
  ChevronRight,
  Clock3,
  ClipboardList,
  FlaskConical,
  ArrowRight,
} from "lucide-react";

import {
  useNavigate,
  useOutletContext,
} from "react-router-dom";

import patientService from "../../services/patientService";


export default function Dashboard() {

  // =========================================================
  // CONTEXT
  // =========================================================

  const outletContext = useOutletContext() || {};
  const profile = outletContext.profile;

  const navigate = useNavigate();


  // =========================================================
  // STATE
  // =========================================================

  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);


  // =========================================================
  // LOAD APPOINTMENTS
  // =========================================================

  useEffect(() => {

    patientService
      .getAppointments()

      .then((data) => {

        setAppointments(
          Array.isArray(data)
            ? data
            : []
        );

      })

      .catch((error) => {

        console.error(
          "Appointments loading error:",
          error
        );

        setAppointments([]);

      });

  }, []);


  // =========================================================
  // LOAD MEDICAL REPORTS
  // =========================================================

  useEffect(() => {

    patientService
      .getReports()

      .then((data) => {

        setReports(
          Array.isArray(data)
            ? data
            : []
        );

      })

      .catch((error) => {

        console.error(
          "Medical reports loading error:",
          error
        );

        setReports([]);

      })

      .finally(() => {

        setLoadingReports(false);

      });

  }, []);


  // =========================================================
  // FILTER UPCOMING APPOINTMENTS
  // =========================================================

  const upcoming = appointments
    .filter(
      (appointment) =>
        appointment.status !== "CANCELLED" &&
        appointment.status !== "COMPLETED"
    )
    .slice(0, 4);


  // =========================================================
  // RECENT REPORTS
  // =========================================================

  const recentReports = reports.slice(0, 3);


  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {

    switch (status) {

      case "CONFIRMED":
        return "bg-emerald-50 text-emerald-700";

      case "PENDING":
        return "bg-amber-50 text-amber-700";

      case "CANCELLED":
        return "bg-red-50 text-red-700";

      case "COMPLETED":
        return "bg-slate-100 text-slate-600";

      default:
        return "bg-blue-50 text-blue-700";
    }
  };


  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="min-h-full bg-[#F6F9FC]">

      <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6">


        {/* =====================================================
            WELCOME SECTION
        ===================================================== */}

        <section
          className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-blue-100
            bg-blue-50
            p-5

            sm:rounded-3xl
            sm:p-7
          "
        >

          {/* Decorative circles */}

          <div
            className="
              absolute
              -right-16
              -top-16
              h-40
              w-40
              rounded-full
              bg-blue-100/70
            "
          />

          <div
            className="
              absolute
              -bottom-20
              right-24
              h-44
              w-44
              rounded-full
              bg-white/40
            "
          />


          {/* Welcome content */}

          <div className="relative z-10">

            <div className="flex items-center gap-2">

              <div className="h-2 w-2 rounded-full bg-blue-600" />

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-blue-600

                  sm:text-sm
                "
              >
                Patient Dashboard
              </p>

            </div>


            <h1
              className="
                mt-2
                text-2xl
                font-bold
                tracking-tight
                text-slate-900

                sm:mt-3
                sm:text-3xl
              "
            >
              Welcome back,{" "}
              {profile?.name || "Patient"}!
            </h1>


            <p
              className="
                mt-2
                max-w-xl
                text-sm
                leading-6
                text-slate-600
              "
            >
              Manage your appointments, medical reports
              and healthcare records from one place.
            </p>

          </div>

        </section>


        {/* =====================================================
            APPOINTMENTS + QUICK ACTIONS
        ===================================================== */}

        <div
          className="
            grid

            grid-cols-[minmax(0,1fr)_82px]

            gap-3

            sm:grid-cols-1

            xl:grid-cols-[1.55fr_1fr]
            xl:gap-5
          "
        >


          {/* =================================================
              MY APPOINTMENTS
          ================================================= */}

          <section
            className="
              min-w-0
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-3
              shadow-[0_2px_8px_rgba(15,23,42,0.04)]

              sm:p-5
            "
          >

            {/* Header */}

            <div
              className="
                mb-3
                flex
                items-center
                justify-between

                sm:mb-4
              "
            >

              <div className="min-w-0">

                <h2
                  className="
                    truncate
                    text-sm
                    font-bold
                    text-slate-900

                    sm:text-lg
                  "
                >
                  My Appointments
                </h2>


                <p
                  className="
                    mt-0.5
                    hidden
                    text-sm
                    text-slate-500

                    sm:block
                  "
                >
                  Your scheduled visits
                </p>

              </div>


              {/* View all */}

              <button
                onClick={() =>
                  navigate(
                    "/patient/appointments"
                  )
                }
                className="
                  flex
                  shrink-0
                  items-center
                  gap-1
                  rounded-lg
                  px-2
                  py-1.5
                  text-xs
                  font-semibold
                  text-blue-600
                  transition

                  hover:bg-blue-50
                "
              >

                <span className="hidden sm:inline">
                  View All
                </span>

                <ChevronRight size={15} />

              </button>

            </div>


            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {upcoming.length === 0 ? (

              <div
                className="
                  flex
                  min-h-[300px]
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  bg-slate-50
                  text-center

                  sm:min-h-0
                  sm:py-10
                "
              >

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-white
                    text-slate-400
                    shadow-sm
                  "
                >
                  <CalendarDays size={22} />
                </div>


                <p
                  className="
                    mt-3
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  No upcoming appointments
                </p>


                <p
                  className="
                    mt-1
                    hidden
                    text-xs
                    text-slate-500

                    sm:block
                  "
                >
                  Your upcoming visits will appear here.
                </p>

              </div>

            ) : (


              /* =================================================
                 APPOINTMENT LIST
              ================================================= */

              <div className="space-y-2">

                {upcoming.map(
                  (appointment) => (

                    <div
                      key={
                        appointment.appointmentId
                      }
                      className="
                        group
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-slate-100
                        p-2.5
                        transition

                        hover:border-blue-100
                        hover:bg-blue-50/40

                        sm:gap-3
                        sm:p-4
                      "
                    >


                      {/* Appointment icon */}

                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-blue-50
                          text-blue-600
                          transition

                          group-hover:bg-blue-100

                          sm:h-11
                          sm:w-11
                        "
                      >
                        <CalendarDays size={17} />
                      </div>


                      {/* Appointment details */}

                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >

                        <p
                          className="
                            truncate
                            text-xs
                            font-semibold
                            text-slate-900

                            sm:text-sm
                          "
                        >
                          Dr.{" "}
                          {appointment.doctorName}
                        </p>


                        <div
                          className="
                            mt-1
                            flex
                            items-center
                            gap-1
                            truncate
                            text-[10px]
                            text-slate-500

                            sm:gap-1.5
                            sm:text-xs
                          "
                        >

                          <span className="truncate">
                            {appointment.appointmentDate}
                          </span>

                          <span>•</span>

                          <span
                            className="
                              flex
                              shrink-0
                              items-center
                              gap-1
                            "
                          >
                            <Clock3 size={11} />

                            {appointment.appointmentTime}
                          </span>

                        </div>

                      </div>


                      {/* Status */}

                      <span
                        className={`
                          hidden
                          shrink-0
                          rounded-full
                          px-2.5
                          py-1
                          text-[10px]
                          font-semibold

                          sm:inline-block

                          ${getStatusStyle(
                            appointment.status
                          )}
                        `}
                      >
                        {appointment.status}
                      </span>

                    </div>

                  )
                )}

              </div>

            )}

          </section>


          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <section
            className="
              min-w-0
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-2
              shadow-[0_2px_8px_rgba(15,23,42,0.04)]

              sm:p-5
            "
          >

            {/* Header */}

            <div className="mb-2 sm:mb-4">

              {/* Mobile heading */}

              <h2
                className="
                  text-center
                  text-[9px]
                  font-bold
                  uppercase
                  leading-3
                  tracking-wide
                  text-slate-700

                  sm:hidden
                "
              >
                Quick
                <br />
                Actions
              </h2>


              {/* Desktop heading */}

              <h2
                className="
                  hidden
                  text-lg
                  font-bold
                  text-slate-900

                  sm:block
                "
              >
                Quick Actions
              </h2>


              <p
                className="
                  mt-0.5
                  hidden
                  text-sm
                  text-slate-500

                  sm:block
                "
              >
                Quickly access your healthcare
              </p>

            </div>


            {/* =================================================
                QUICK ACTION BUTTONS
            ================================================= */}

            <div
              className="
                grid
                grid-cols-1
                gap-2

                sm:grid-cols-2
                sm:gap-3
              "
            >

              {/* Appointments */}

              <QuickAction
                icon={
                  <CalendarDays size={19} />
                }
                title="Appointments"
                description="Manage visits"
                onClick={() =>
                  navigate(
                    "/patient/appointments"
                  )
                }
              />


              {/* Reports */}

              <QuickAction
                icon={
                  <FileText size={19} />
                }
                title="Medical Reports"
                description="View records"
                onClick={() =>
                  navigate(
                    "/patient/reports"
                  )
                }
              />


              {/* Lab Tests */}

              <QuickAction
                icon={
                  <FlaskConical size={19} />
                }
                title="Lab Tests"
                description="View tests"
                onClick={() =>
                  navigate(
                    "/patient/lab-tests"
                  )
                }
              />


              {/* Lab Orders */}

              <QuickAction
                icon={
                  <ClipboardList size={19} />
                }
                title="Lab Orders"
                description="Track orders"
                onClick={() =>
                  navigate(
                    "/patient/lab-orders"
                  )
                }
              />

            </div>

          </section>

        </div>


        {/* =====================================================
            MEDICAL REPORTS
        ===================================================== */}

        <section
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-4
            shadow-[0_2px_8px_rgba(15,23,42,0.04)]

            sm:p-5
          "
        >

          {/* Header */}

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div
              className="
                flex
                min-w-0
                items-center
                gap-3
              "
            >

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                "
              >
                <FileText size={21} />
              </div>


              <div className="min-w-0">

                <h2
                  className="
                    truncate
                    text-base
                    font-bold
                    text-slate-900

                    sm:text-lg
                  "
                >
                  Medical Reports
                </h2>


                <p
                  className="
                    mt-0.5
                    truncate
                    text-xs
                    text-slate-500

                    sm:text-sm
                  "
                >
                  Your recent medical records
                </p>

              </div>

            </div>


            {/* View All */}

            <button
              onClick={() =>
                navigate(
                  "/patient/reports"
                )
              }
              className="
                flex
                shrink-0
                items-center
                gap-1
                rounded-lg
                px-2
                py-1.5
                text-xs
                font-semibold
                text-blue-600
                transition

                hover:bg-blue-50

                sm:text-sm
              "
            >

              <span className="hidden sm:inline">
                View All
              </span>

              <ChevronRight size={15} />

            </button>

          </div>


          {/* =================================================
              REPORT CONTENT
          ================================================= */}

          <div className="mt-5">

            {/* Loading */}

            {loadingReports ? (

              <div className="py-8 text-center">

                <div
                  className="
                    mx-auto
                    h-6
                    w-6
                    animate-spin
                    rounded-full
                    border-2
                    border-slate-200
                    border-t-blue-600
                  "
                />

                <p
                  className="
                    mt-3
                    text-sm
                    text-slate-400
                  "
                >
                  Loading medical reports...
                </p>

              </div>


            ) : recentReports.length === 0 ? (


              /* =================================================
                 NO REPORTS
              ================================================= */

              <div
                className="
                  rounded-xl
                  bg-slate-50
                  py-9
                  text-center
                "
              >

                <div
                  className="
                    mx-auto
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-white
                    text-slate-400
                    shadow-sm
                  "
                >
                  <FileText size={23} />
                </div>


                <p
                  className="
                    mt-3
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  No medical reports yet
                </p>


                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-500

                    sm:text-sm
                  "
                >
                  Your medical reports will appear here.
                </p>

              </div>


            ) : (


              /* =================================================
                 REPORT LIST
              ================================================= */

              <div className="space-y-2">

                {recentReports.map(
                  (report, index) => (

                    <div
                      key={
                        report.id ||
                        report.reportId ||
                        index
                      }
                      className="
                        group
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-slate-100
                        p-3
                        transition

                        hover:border-blue-100
                        hover:bg-blue-50/40

                        sm:p-4
                      "
                    >

                      {/* Icon */}

                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-blue-50
                          text-blue-600
                          transition

                          group-hover:bg-blue-100
                        "
                      >
                        <FileText size={18} />
                      </div>


                      {/* Information */}

                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >

                        <p
                          className="
                            truncate
                            text-sm
                            font-semibold
                            text-slate-800
                          "
                        >
                          {report.diagnosis ||
                            report.title ||
                            report.reportName ||
                            "Medical Report"}
                        </p>


                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-500
                          "
                        >
                          {report.createdAt
                            ? new Date(
                                report.createdAt
                              ).toLocaleDateString()
                            : report.date
                            ? report.date
                            : "Medical Record"}
                        </p>

                      </div>


                      {/* View */}

                      <button
                        onClick={() =>
                          navigate(
                            "/patient/reports"
                          )
                        }
                        className="
                          flex
                          shrink-0
                          items-center
                          gap-1
                          rounded-lg
                          px-2.5
                          py-1.5
                          text-xs
                          font-semibold
                          text-blue-600
                          transition

                          hover:bg-blue-50
                        "
                      >

                        <span className="hidden sm:inline">
                          View
                        </span>

                        <ArrowRight size={14} />

                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </section>

      </div>

    </div>

  );
}


/* =============================================================
   QUICK ACTION COMPONENT
============================================================= */

function QuickAction({
  icon,
  title,
  description,
  onClick,
}) {

  return (

    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className="
        group
        flex
        h-[58px]
        w-full
        items-center
        justify-center
        rounded-xl
        border
        border-slate-100
        bg-slate-50
        transition-all

        hover:border-blue-100
        hover:bg-blue-50
        hover:shadow-sm

        sm:h-auto
        sm:justify-start
        sm:gap-3
        sm:bg-white
        sm:p-3

        md:p-4
      "
    >

      {/* Icon */}

      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-blue-50
          text-blue-600
          transition

          group-hover:bg-blue-100
        "
      >
        {icon}
      </div>


      {/* Text - desktop/tablet only */}

      <div
        className="
          hidden
          min-w-0
          text-left

          sm:block
        "
      >

        <p
          className="
            truncate
            text-sm
            font-semibold
            text-slate-800
          "
        >
          {title}
        </p>


        <p
          className="
            mt-0.5
            truncate
            text-xs
            text-slate-500
          "
        >
          {description}
        </p>

      </div>

    </button>

  );
}