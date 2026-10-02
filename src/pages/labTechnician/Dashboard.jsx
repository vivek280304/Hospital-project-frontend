import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  FlaskConical,
  CheckCircle2,
  Clock3,
  Image,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import labTechnicianService from "../../services/labTechnicianService";

export default function Dashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [imagingOrders, setImagingOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [ordered, claimed, collected, processing, completed, imaging] =
        await Promise.all([
          labTechnicianService.getLabOrders("ORDERED"),
          labTechnicianService.getLabOrders("CLAIMED"),
          labTechnicianService.getLabOrders("SAMPLE_COLLECTED"),
          labTechnicianService.getLabOrders("PROCESSING"),
          labTechnicianService.getLabOrders("COMPLETED"),
          labTechnicianService.getPendingImagingOrders(),
        ]);

      setOrders([
        ...(ordered || []),
        ...(claimed || []),
        ...(collected || []),
        ...(processing || []),
        ...(completed || []),
      ]);

      setImagingOrders(imaging || []);

    } catch (error) {
      console.error("Failed to load lab dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const getCount = (status) =>
      orders.filter((order) => order.status === status).length;

    return {
      ordered: getCount("ORDERED"),
      claimed: getCount("CLAIMED"),
      processing: getCount("PROCESSING"),
      completed: getCount("COMPLETED"),
    };
  }, [orders]);

  const recentOrders = orders.slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl">

      {/* Header */}
      <div className="mb-6">

        <p className="text-sm font-semibold text-blue-600">
          Laboratory
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Lab Technician Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage laboratory orders, samples, tests and reports.
        </p>

      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2
            size={32}
            className="animate-spin text-blue-600"
          />
        </div>
      ) : (
        <>
          {/* Stats */}
          <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">

            <StatCard
              icon={<ClipboardList size={22} />}
              label="Pending Orders"
              value={stats.ordered}
              iconClass="bg-orange-50 text-orange-600"
            />

            <StatCard
              icon={<Clock3 size={22} />}
              label="Claimed Orders"
              value={stats.claimed}
              iconClass="bg-blue-50 text-blue-600"
            />

            <StatCard
              icon={<FlaskConical size={22} />}
              label="Processing"
              value={stats.processing}
              iconClass="bg-purple-50 text-purple-600"
            />

            <StatCard
              icon={<CheckCircle2 size={22} />}
              label="Completed"
              value={stats.completed}
              iconClass="bg-green-50 text-green-600"
            />

          </section>

          {/* Main */}
          <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">

            {/* Orders */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                <div>
                  <h2 className="font-bold text-slate-900">
                    Recent Lab Orders
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Latest laboratory work
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate("/lab-technician/orders")
                  }
                  className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  View all
                  <ArrowRight size={15} />
                </button>

              </div>

              {recentOrders.length === 0 ? (
                <EmptyState text="No lab orders found." />
              ) : (
                <div className="divide-y divide-slate-100">

                  {recentOrders.map((order) => (
                    <div
                      key={order.orderId}
                      className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:px-5"
                    >

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <FlaskConical size={19} />
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-bold text-slate-800">
                          {order.testName || "Laboratory Test"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {order.patientName || "Patient"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Order #{order.orderId}
                        </p>

                      </div>

                      <StatusBadge status={order.status} />

                    </div>
                  ))}

                </div>
              )}

            </div>

            {/* Quick Actions */}
            <div className="space-y-4">

              <div className="rounded-2xl border border-slate-200 bg-white p-5">

                <h2 className="font-bold text-slate-900">
                  Quick Actions
                </h2>

                <div className="mt-4 space-y-3">

                  <QuickAction
                    icon={<ClipboardList size={19} />}
                    title="Lab Orders"
                    subtitle="View pending orders"
                    onClick={() =>
                      navigate("/lab-technician/orders")
                    }
                  />

                  <QuickAction
                    icon={<FlaskConical size={19} />}
                    title="My Work"
                    subtitle="Continue assigned tests"
                    onClick={() =>
                      navigate("/lab-technician/my-work")
                    }
                  />

                  <QuickAction
                    icon={<Image size={19} />}
                    title="Imaging"
                    subtitle="Pending imaging orders"
                    onClick={() =>
                      navigate("/lab-technician/imaging")
                    }
                  />

                </div>

              </div>

              {/* Imaging */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Imaging
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {imagingOrders.length}
                    </p>

                    <p className="text-xs text-slate-500">
                      Pending imaging orders
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <Image size={21} />
                  </div>

                </div>

                <button
                  onClick={() =>
                    navigate("/lab-technician/imaging")
                  }
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Open Imaging
                  <ArrowRight size={16} />
                </button>

              </div>

            </div>

          </section>
        </>
      )}

    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">

      <div className="flex items-start justify-between gap-3">

        <div>
          <p className="text-xs font-medium text-slate-500 sm:text-sm">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    ORDERED: "bg-orange-50 text-orange-600",
    CLAIMED: "bg-blue-50 text-blue-600",
    SAMPLE_COLLECTED: "bg-indigo-50 text-indigo-600",
    PROCESSING: "bg-purple-50 text-purple-600",
    COMPLETED: "bg-green-50 text-green-600",
  };

  const label = (status || "UNKNOWN")
    .replaceAll("_", " ");

  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {label}
    </span>
  );
}

function QuickAction({
  icon,
  title,
  subtitle,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-slate-500">
          {subtitle}
        </p>
      </div>

      <ArrowRight
        size={16}
        className="shrink-0 text-slate-300"
      />
    </button>
  );
}

function EmptyState({ text }) {
  return (
    <div className="py-12 text-center text-sm text-slate-400">
      {text}
    </div>
  );
}