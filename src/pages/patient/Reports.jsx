import { useEffect, useState } from "react";

import {
  FileText,
  Loader2,
  CalendarDays,
  UserRound,
  Hash,
  Stethoscope,
  ChevronRight,
  ClipboardList,
  Pill,
  Activity,
  NotebookPen,
} from "lucide-react";

import patientService from "../../services/patientService";


export default function Reports() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);


  // =========================================================
  // LOAD REPORTS
  // =========================================================

  useEffect(() => {

    patientService
      .getReports()

      .then((response) => {

        setData(
          Array.isArray(response)
            ? response
            : []
        );

      })

      .catch((error) => {

        console.error(
          "Medical reports loading error:",
          error
        );

        setData([]);

      })

      .finally(() => {

        setLoading(false);

      });

  }, []);


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <Page
      title="Medical Reports"
      subtitle="View your medical history and clinical reports"
    >

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      {!loading && data.length > 0 && (

        <div
          className="
            mb-5
            flex
            items-center
            gap-3
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

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-white
              text-blue-600
              shadow-sm
            "
          >
            <FileText size={19} />
          </div>

          <div>

            <p className="text-xs text-slate-500">
              Total Medical Reports
            </p>

            <p className="text-lg font-bold text-slate-900">
              {data.length}
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
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-[0_2px_8px_rgba(15,23,42,0.04)]
          "
        >

          <Loader2
            size={28}
            className="animate-spin text-blue-600"
          />

          <p className="mt-3 text-sm text-slate-500">
            Loading medical reports...
          </p>

        </div>


      ) : data.length === 0 ? (

        <Empty
          text="No medical reports found."
        />


      ) : (

        /* ===================================================
           REPORT LIST
        =================================================== */

        <div className="grid gap-4 lg:grid-cols-2">

          {data.map((report, index) => (

            <ReportCard
              key={
                report.id ||
                report.reportId ||
                index
              }
              report={report}
            />

          ))}

        </div>

      )}

    </Page>

  );
}


/* =============================================================
   REPORT CARD
============================================================= */

function ReportCard({ report }) {

  return (

    <article
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

      {/* =====================================================
          REPORT HEADER
      ===================================================== */}

      <div
        className="
          border-b
          border-slate-100
          p-4

          sm:p-5
        "
      >

        <div className="flex items-start gap-3">

          {/* Icon */}

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
              transition

              group-hover:bg-blue-100
            "
          >
            <FileText size={21} />
          </div>


          {/* Title */}

          <div className="min-w-0 flex-1">

            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-blue-600
              "
            >
              Medical Report
            </p>

            <h2
              className="
                mt-1
                truncate
                text-base
                font-bold
                text-slate-900

                sm:text-lg
              "
            >
              {report.diagnosis ||
                report.title ||
                report.reportName ||
                "Medical Report"}
            </h2>

          </div>

        </div>


        {/* =================================================
            APPOINTMENT INFORMATION
        ================================================= */}

        <div
          className="
            mt-4
            grid
            grid-cols-1
            gap-2

            sm:grid-cols-3
          "
        >

          {/* Appointment ID */}

          <MetaItem
            icon={<Hash size={14} />}
            label="Appointment ID"
            value={
              report.appointmentId
                ? `#${report.appointmentId}`
                : "Not available"
            }
          />


          {/* Doctor */}

          <MetaItem
            icon={<UserRound size={14} />}
            label="Doctor"
            value={
              report.doctorName ||
              "Not available"
            }
          />


          {/* Appointment Date */}

          <MetaItem
            icon={<CalendarDays size={14} />}
            label="Appointment Date"
            value={
              report.appointmentDate ||
              "Not available"
            }
          />

        </div>

      </div>


      {/* =====================================================
          REPORT DETAILS
      ===================================================== */}

      <div className="space-y-4 p-4 sm:p-5">

        {/* Symptoms */}

        <Info
          icon={<Activity size={16} />}
          label="Symptoms"
          value={report.symptoms}
        />


        {/* Treatment */}

        <Info
          icon={<Stethoscope size={16} />}
          label="Treatment"
          value={report.treatment}
        />


        {/* Prescription */}

        <Info
          icon={<Pill size={16} />}
          label="Prescription"
          value={report.prescription}
        />


        {/* Notes */}

        <Info
          icon={<NotebookPen size={16} />}
          label="Doctor's Notes"
          value={report.notes}
        />

      </div>


      {/* =====================================================
          REPORT FOOTER
      ===================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          border-t
          border-slate-100
          bg-slate-50/70
          px-4
          py-3

          sm:px-5
        "
      >

        <div className="flex items-center gap-2">

          <ClipboardList
            size={14}
            className="text-slate-400"
          />

          <span className="text-xs text-slate-500">
            Medical record
          </span>

        </div>


        <div className="flex items-center gap-1 text-xs font-semibold text-blue-600">

          View Details

          <ChevronRight size={14} />

        </div>

      </div>

    </article>

  );
}


/* =============================================================
   META ITEM
============================================================= */

function MetaItem({
  icon,
  label,
  value,
}) {

  return (

    <div
      className="
        min-w-0
        rounded-xl
        bg-slate-50
        px-3
        py-2.5
      "
    >

      <div className="flex items-center gap-1.5">

        <span className="shrink-0 text-blue-600">
          {icon}
        </span>

        <p
          className="
            truncate
            text-[9px]
            font-semibold
            uppercase
            tracking-wide
            text-slate-400
          "
        >
          {label}
        </p>

      </div>


      <p
        className="
          mt-1
          truncate
          text-xs
          font-semibold
          text-slate-700
        "
      >
        {value}
      </p>

    </div>

  );
}


/* =============================================================
   INFORMATION ROW
============================================================= */

function Info({
  icon,
  label,
  value,
}) {

  return (

    <div>

      <div className="flex items-center gap-2">

        <div
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-blue-50
            text-blue-600
          "
        >
          {icon}
        </div>

        <p
          className="
            text-[10px]
            font-bold
            uppercase
            tracking-wider
            text-slate-400
          "
        >
          {label}
        </p>

      </div>


      <p
        className="
          mt-2
          pl-9
          text-sm
          leading-6
          text-slate-700
        "
      >
        {value || "Not available"}
      </p>

    </div>

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

        {/* Header */}

        <div>

          <div className="flex items-center gap-2">

            <div className="h-2 w-2 rounded-full bg-blue-600" />

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-blue-600
              "
            >
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
        <FileText size={25} />
      </div>


      <p className="mt-4 text-sm font-semibold text-slate-700">
        {text}
      </p>


      <p
        className="
          mt-1
          max-w-sm
          text-xs
          leading-5
          text-slate-400
        "
      >
        Medical reports created by your healthcare
        providers will appear here.
      </p>

    </div>

  );
}