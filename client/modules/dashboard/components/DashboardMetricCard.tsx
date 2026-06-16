import type { ReactNode } from "react";

interface DashboardMetricCardProps {
  label: string;
  value: string | number;
  detail?: string;
  icon: ReactNode;
  tone?: "blue" | "green" | "slate" | "amber" | "rose" | "teal";
}

const toneClasses = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
  slate: "bg-slate-50 text-slate-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
  teal: "bg-teal-50 text-teal-700",
};

export function DashboardMetricCard({
  label,
  value,
  detail,
  icon,
  tone = "slate",
}: DashboardMetricCardProps) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
        </div>

        <div className={`rounded-md p-2.5 ${toneClasses[tone]}`}>{icon}</div>
      </div>

      {detail && <p className="mt-3 text-sm text-slate-500">{detail}</p>}
    </div>
  );
}
