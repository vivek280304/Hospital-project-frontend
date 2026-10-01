import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Hash,
  Loader2,
  XCircle,
  ChevronRight,
  Stethoscope,
} from "lucide-react";

import patientService from "../../services/patientService";


export default function Appointments() {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);


  // =========================================================
  // LOAD APPOINTMENTS
  // =========================================================

  const load = async () => {

    try {

      setLoading(true);

      const data =
        await patientService.getAppointments();

      setItems(
        Array.isArray(data)
          ? data
          : []
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    load().catch((error) => {
      console.error(
        "Appointments loading error:",
        error
      );
    });

  }, []);


  // =========================================================
  // CANCEL APPOINTMENT
  // =========================================================

  const cancel = async (id) => {

    if (
      !window.confirm(
        "Are you sure you want to cancel this appointment?"
      )
    ) {
      return;
    }

    try {

      setBusy(id);

      await patientService.cancelAppointment(id);

      await load();

    } catch (error) {

      console.error(
        "Cancel appointment error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Unable to cancel appointment."
      );

    } finally {

      setBusy(null);

    }

  };


  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {

    switch (status) {

      case "BOOKED":
      case "CONFIRMED":
        return {
          badge:
            "bg-emerald-50 text-emerald-700 border-emerald-100",
          dot: "bg-emerald-500",
        };

      case "PENDING":
        return {
          badge:
            "bg-amber-50 text-amber-700 border-amber-100",
          dot: "bg-amber-500",
        };

      case "COMPLETED":
        return {
          badge:
            "bg-slate-100 text-slate-600 border-slate-200",
          dot: "bg-slate-500",
        };

      case "CANCELLED":
        return {
          badge:
            "bg-red-50 text-red-700 border-red-100",
          dot: "bg-red-500",
        };

      default:
        return {
          badge:
            "bg-blue-50 text-blue-700 border-blue-100",
          dot: "bg-blue-500",
        };

    }

  };


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <Page
      title="My Appointments"
      subtitle="View and manage your scheduled appointments"
    >

      {/* =====================================================
          HEADER ACTION / SUMMARY
      ===================================================== */}

      {!loading && items.length > 0 && (

        <div
          className="
            mb-4
            flex
            items-center
            justify-between
            rounded-2xl
            border
            border-blue-100
            bg-blue-50
            px-4
            py-3

            sm:px-5
            sm:py-4
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-white
                text-blue-600
                shadow-sm
              "
            >
              <CalendarDays size={19} />
            </div>

            <div>

              <p className="text-xs text-slate-500">
                Total Appointments
              </p>

              <p className="text-lg font-bold text-slate-900">
                {items.length}
              </p>

            </div>

          </div>

          <div className="hidden text-right sm:block">

            <p className="text-xs text-slate-500">
              Keep track of your
            </p>

            <p className="text-sm font-semibold text-blue-600">
              upcoming visits
            </p>

          </div>

        </div>

      )}


      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (

        <div
          className="
            flex
            min-h-[300px]
            items-center
            justify-center
            rounded-2xl
            border
            border-slate-200
            bg-white
          "
        >

          <div className="flex flex-col items-center">

            <Loader2
              size={28}
              className="animate-spin text-blue-600"
            />

            <p className="mt-3 text-sm text-slate-500">
              Loading appointments...
            </p>

          </div>

        </div>


      ) : items.length === 0 ? (

        /* ===================================================
           EMPTY STATE
        =================================================== */

        <Empty text="No appointments found." />


      ) : (

        /* ===================================================
           APPOINTMENT LIST
        =================================================== */

        <div className="space-y-3">

          {items.map((appointment) => {

            const statusStyle =
              getStatusStyle(
                appointment.status
              );

            const canCancel =
              appointment.status === "BOOKED";


            return (

              <article
                key={appointment.appointmentId}
                className="
                  group
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  shadow-[0_2px_8px_rgba(15,23,42,0.04)]
                  transition-all

                  hover:border-blue-100
                  hover:shadow-[0_4px_14px_rgba(37,99,235,0.08)]
                "
              >

                {/* =================================================
                    APPOINTMENT TOP
                ================================================= */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-slate-100
                    px-4
                    py-3

                    sm:px-5
                  "
                >

                  {/* Appointment ID */}

                  <div className="flex items-center gap-2">

                    <div
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-slate-50
                        text-slate-500
                      "
                    >
                      <Hash size={15} />
                    </div>

                    <div>

                      <p className="text-[10px] uppercase tracking-wide text-slate-400">
                        Appointment ID
                      </p>

                      <p className="text-xs font-bold text-slate-700 sm:text-sm">
                        #{appointment.appointmentId}
                      </p>

                    </div>

                  </div>


                  {/* Status */}

                  <span
                    className={`
                      flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      px-2.5
                      py-1
                      text-[10px]
                      font-semibold

                      sm:px-3
                      sm:text-xs

                      ${statusStyle.badge}
                    `}
                  >

                    <span
                      className={`
                        h-1.5
                        w-1.5
                        rounded-full

                        ${statusStyle.dot}
                      `}
                    />

                    {appointment.status}

                  </span>

                </div>


                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <div className="p-4 sm:p-5">

                  <div
                    className="
                      flex
                      flex-col
                      gap-4

                      sm:flex-row
                      sm:items-center
                    "
                  >

                    {/* Doctor */}

                    <div
                      className="
                        flex
                        min-w-0
                        flex-1
                        items-center
                        gap-3
                      "
                    >

                      <div
                        className="
                          flex
                          h-12
                          w-12
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-blue-50
                          text-blue-600

                          sm:h-14
                          sm:w-14
                        "
                      >
                        <Stethoscope
                          size={22}
                        />
                      </div>


                      <div className="min-w-0">

                        <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                          Doctor
                        </p>

                        <p className="mt-0.5 truncate text-sm font-bold text-slate-900 sm:text-base">
                          Dr. {appointment.doctorName}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          Scheduled appointment
                        </p>

                      </div>

                    </div>


                    {/* Date */}

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        bg-slate-50
                        px-3
                        py-2.5

                        sm:min-w-[150px]
                      "
                    >

                      <CalendarDays
                        size={18}
                        className="shrink-0 text-blue-600"
                      />

                      <div>

                        <p className="text-[10px] uppercase tracking-wide text-slate-400">
                          Date
                        </p>

                        <p className="text-xs font-semibold text-slate-700">
                          {appointment.appointmentDate}
                        </p>

                      </div>

                    </div>


                    {/* Time */}

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        bg-slate-50
                        px-3
                        py-2.5

                        sm:min-w-[130px]
                      "
                    >

                      <Clock3
                        size={18}
                        className="shrink-0 text-blue-600"
                      />

                      <div>

                        <p className="text-[10px] uppercase tracking-wide text-slate-400">
                          Time
                        </p>

                        <p className="text-xs font-semibold text-slate-700">
                          {appointment.appointmentTime}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* =================================================
                      BOTTOM ACTIONS
                  ================================================= */}

                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      justify-between
                      border-t
                      border-slate-100
                      pt-3
                    "
                  >

                    <p className="hidden text-xs text-slate-400 sm:block">
                      Appointment #{appointment.appointmentId}
                    </p>


                    {canCancel ? (

                      <button
                        onClick={() =>
                          cancel(
                            appointment.appointmentId
                          )
                        }
                        disabled={
                          busy ===
                          appointment.appointmentId
                        }
                        className="
                          flex
                          items-center
                          gap-1.5
                          rounded-lg
                          border
                          border-red-200
                          px-3
                          py-2
                          text-xs
                          font-semibold
                          text-red-600
                          transition

                          hover:bg-red-50
                          disabled:cursor-not-allowed
                          disabled:opacity-50

                          sm:px-4
                        "
                      >

                        {busy ===
                        appointment.appointmentId ? (

                          <>
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />

                            Cancelling...
                          </>

                        ) : (

                          <>
                            <XCircle size={14} />

                            Cancel Appointment
                          </>

                        )}

                      </button>

                    ) : (

                      <div className="ml-auto flex items-center gap-1 text-xs text-slate-400">

                        <span>
                          {appointment.status ===
                          "COMPLETED"
                            ? "Appointment completed"
                            : appointment.status ===
                              "CANCELLED"
                            ? "Appointment cancelled"
                            : "No actions available"}
                        </span>

                        <ChevronRight
                          size={14}
                        />

                      </div>

                    )}

                  </div>

                </div>

              </article>

            );

          })}

        </div>

      )}

    </Page>

  );
}


/* =============================================================
   PAGE WRAPPER
============================================================= */

function Page({
  title,
  subtitle,
  children,
}) {

  return (

    <div className="min-h-full bg-[#F6F9FC]">

      <div
        className="
          mx-auto
          max-w-7xl
          space-y-5

          sm:space-y-6
        "
      >

        {/* Page header */}

        <div>

          <div className="flex items-start justify-between">

            <div>

              <div className="flex items-center gap-2">

                <div className="h-2 w-2 rounded-full bg-blue-600" />

                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Patient Portal
                </p>

              </div>

              <h1
                className="
                  mt-2
                  text-2xl
                  font-bold
                  tracking-tight
                  text-slate-900

                  sm:text-3xl
                "
              >
                {title}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {subtitle}
              </p>

            </div>

          </div>

        </div>


        {children}

      </div>

    </div>

  );
}


/* =============================================================
   EMPTY STATE
============================================================= */

function Empty({ text }) {

  return (

    <div
      className="
        flex
        min-h-[300px]
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-slate-200
        bg-white
        px-5
        text-center
        shadow-[0_2px_8px_rgba(15,23,42,0.04)]
      "
    >

      <div
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-blue-50
          text-blue-600
        "
      >
        <CalendarDays size={25} />
      </div>


      <p className="mt-4 text-sm font-semibold text-slate-700">
        {text}
      </p>


      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
        Your scheduled appointments will appear here
        once you book a visit.
      </p>

    </div>

  );
}