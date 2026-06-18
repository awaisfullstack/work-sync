"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  Activity,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  ListChecks,
  ShieldCheck,
  TimerReset,
  Users,
} from "lucide-react";

import LoadTableError from "@/components/common/LoadTableError";
import { formatDateTime } from "@/lib/utils/formatDate";
import { formatDecimalHoursDuration } from "@/lib/utils/duration";
import { logFrontendError } from "@/lib/logger/frontendLogger";
import { DashboardRecentActivity } from "@/modules/dashboard/components/DashboardRecentActivity";
import { useGetDashboardQuery } from "@/store/api/dashboardApi";
import { useAppSelector } from "@/store/hooks";
import { Role } from "@/types/auth.types";
import type {
  AdminDashboard,
  DashboardData,
  EmployeeDashboard,
} from "@/types/dashboard.types";
import DashboardLoading from "./DashboardLoading";
import { DashboardMetricCard } from "./DashboardMetricCard";

interface DashboardPageClientProps {
  initialDashboard?: DashboardData;
}

interface DetailItem {
  label: string;
  value: string | number;
  icon: ReactNode;
}

function getDetails(dashboard: DashboardData): DetailItem[] {
  if (dashboard.role === Role.ADMIN) {
    return getAdminDetails(dashboard);
  }

  return getEmployeeDetails(dashboard);
}

function getAdminDetails(dashboard: AdminDashboard): DetailItem[] {
  return [
    {
      label: "Users",
      value: dashboard.stats.totalUsers,
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: "Employees",
      value: dashboard.stats.totalEmployees,
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: "Tasks",
      value: dashboard.stats.totalTasks,
      icon: <ListChecks className="h-4 w-4" />,
    },
    {
      label: "Projects",
      value: dashboard.stats.totalProjects,
      icon: <BriefcaseBusiness className="h-4 w-4" />,
    },
    {
      label: "Active Shifts",
      value: dashboard.stats.activeShifts,
      icon: <TimerReset className="h-4 w-4" />,
    },
    {
      label: "Overdue Tasks",
      value: dashboard.stats.overdueTasks,
      icon: <CalendarClock className="h-4 w-4" />,
    },
  ];
}

function getEmployeeDetails(dashboard: EmployeeDashboard): DetailItem[] {
  return [
    {
      label: "My Projects",
      value: dashboard.stats.myProjects,
      icon: <BriefcaseBusiness className="h-4 w-4" />,
    },
    {
      label: "Assigned Tasks",
      value: dashboard.stats.assignedTasks,
      icon: <ListChecks className="h-4 w-4" />,
    },
    {
      label: "Open Tasks",
      value: dashboard.stats.openTasks,
      icon: <ClipboardCheck className="h-4 w-4" />,
    },
    {
      label: "Due Soon",
      value: dashboard.stats.dueSoonTasks,
      icon: <CalendarClock className="h-4 w-4" />,
    },
    {
      label: "Overdue Tasks",
      value: dashboard.stats.overdueTasks,
      icon: <CalendarClock className="h-4 w-4" />,
    },
    {
      label: "Current Shift",
      value: dashboard.stats.hasActiveShift ? "Active" : "Inactive",
      icon: <TimerReset className="h-4 w-4" />,
    },
  ];
}

function DashboardDetails({ dashboard }: { dashboard: DashboardData }) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-900">
          {dashboard.role === Role.ADMIN ? "Team Details" : "My Details"}
        </p>
        {dashboard.role === Role.EMPLOYEE && dashboard.activeShift && (
          <p className="text-xs text-slate-500">
            Clocked in {formatDateTime(dashboard.activeShift.clockInAt)}
          </p>
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {getDetails(dashboard).map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-3 rounded-md border px-4 py-3"
          >
            <span className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
              <span className="text-slate-400">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </span>
            <span className="text-sm font-semibold text-slate-900">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPageClient({
  initialDashboard,
}: DashboardPageClientProps) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError, error, refetch } = useGetDashboardQuery(
    undefined,
    {
      skip: !!initialDashboard,
    },
  );
  const loggedDashboardError = useRef(false);
  const dashboard = data?.data ?? initialDashboard;

  useEffect(() => {
    if (!isError || loggedDashboardError.current) {
      return;
    }

    loggedDashboardError.current = true;
    void logFrontendError("Dashboard fetch error", error, {
      source: "dashboard.fetch",
      metadata: {
        userId: currentUser?.id ?? null,
        role: currentUser?.role ?? null,
      },
    });
  }, [currentUser?.id, currentUser?.role, error, isError]);

  if (isLoading && !dashboard) {
    return <DashboardLoading />;
  }

  if (isError || !dashboard) {
    return (
      <section className="py-6">
        <LoadTableError
          title="Failed to load dashboard"
          message="An error occurred while fetching dashboard data. Please try again."
          refetch={refetch}
        />
      </section>
    );
  }

  const isAdmin = dashboard.role === Role.ADMIN;

  return (
    <section className="flex flex-col gap-6 py-6">
      <div className="rounded-lg border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">
              {isAdmin ? "Team overview" : "Your work overview"}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              Welcome back, {currentUser?.name ?? "there"}
            </h2>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
            {isAdmin ? (
              <ShieldCheck className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            {dashboard.role}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard
          label="Completed Tasks"
          value={dashboard.completedTasks}
          detail={isAdmin ? "Across the team" : "Assigned to you"}
          icon={<ClipboardCheck className="h-5 w-5" />}
          tone="green"
        />
        <DashboardMetricCard
          label="Active Projects"
          value={dashboard.activeProjects}
          detail={isAdmin ? "Running now" : "Projects you are on"}
          icon={<BriefcaseBusiness className="h-5 w-5" />}
          tone="teal"
        />
        <DashboardMetricCard
          label="Hours This Week"
          value={formatDecimalHoursDuration(dashboard.weeklyWorkedHours)}
          detail="Completed shifts"
          icon={<CalendarClock className="h-5 w-5" />}
          tone="amber"
        />
        <DashboardMetricCard
          label="Recent Activity"
          value={dashboard.recentActivity.length}
          detail="Latest updates"
          icon={<Activity className="h-5 w-5" />}
          tone="blue"
        />
      </div>

      <DashboardDetails dashboard={dashboard} />
      <DashboardRecentActivity logs={dashboard.recentActivity} />
    </section>
  );
}
