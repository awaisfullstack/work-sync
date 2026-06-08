import type { DashboardSummaryItem } from "../dashboardTypes";

interface DashboardSummaryCardProps<TStatus extends string> {
  title: string;
  items: DashboardSummaryItem<TStatus>[];
  formatLabel: (status: TStatus) => string;
}

export function DashboardSummaryCard<TStatus extends string>({
  title,
  items,
  formatLabel,
}: DashboardSummaryCardProps<TStatus>) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <p className="text-sm text-slate-500">{total} total</p>
      </div>

      <div className="mt-5 space-y-4">
        {items.map((item) => {
          const percentage = total > 0 ? (item.count / total) * 100 : 0;

          return (
            <div key={item.status} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-600">
                  {formatLabel(item.status)}
                </span>
                <span className="text-sm font-medium text-slate-900">
                  {item.count}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-sm bg-slate-100">
                <div
                  className="h-full rounded-sm bg-teal-600"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
