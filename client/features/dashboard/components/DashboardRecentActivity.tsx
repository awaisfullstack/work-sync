import { ActivityActionBadge } from "@/features/activity-logs/components/ActivityActionBadge";
import { ActivityEntityBadge } from "@/features/activity-logs/components/ActivityEntityBadge";
import type { ActivityLog } from "@/features/activity-logs/activityLogTypes";
import { formatDateTime } from "@/lib/utils/formatDate";

interface DashboardRecentActivityProps {
  logs: ActivityLog[];
}

export function DashboardRecentActivity({ logs }: DashboardRecentActivityProps) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-900">Recent Activity</p>
        <p className="text-sm text-slate-500">{logs.length} events</p>
      </div>

      <div className="mt-5 divide-y">
        {logs.length === 0 ? (
          <p className="py-6 text-sm text-slate-500">No recent activity.</p>
        ) : (
          logs.slice(0, 6).map((log) => (
            <div key={log.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {log.message}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {log.actor?.name ?? "System"} -{" "}
                    {formatDateTime(log.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <ActivityActionBadge action={log.action} />
                  <ActivityEntityBadge entityType={log.entityType} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
