"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Clock3,
  ClipboardCheck,
  FolderOpen,
  ListChecks,
  ShieldCheck,
  TimerReset,
  Users,
} from "lucide-react";

import LoadTableError from "@/components/shared/LoadTableError";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Role } from "@/constants";
import { formatDateTime } from "@/lib/utils/formatDate";
import { logFrontendError } from "@/lib/logger/frontendLogger";
import { useAppSelector } from "@/store/hooks";
import { isSuccessResponse } from "@/types/api-response";
import { useGetDashboardQuery } from "../dashboardApi";
import type {
  AdminDashboard,
  BaseDashboard,
  DashboardData,
  DashboardProjectStatus,
  DashboardTaskStatus,
  EmployeeDashboard,
} from "../dashboardTypes";
import { DashboardMetricCard } from "./DashboardMetricCard";
import { DashboardRecentActivity } from "./DashboardRecentActivity";
import { DashboardSummaryCard } from "./DashboardSummaryCard";

function formatStatusLabel(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function formatHours(hours: number) {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (wholeHours === 0 && minutes === 0) return "0m";
  if (wholeHours === 0) return `${minutes}m`;
  if (minutes === 0) return `${wholeHours}h`;

  return `${wholeHours}h ${minutes}m`;
}

function DashboardLoading() {
  return (
    <section className="flex flex-col gap-6 py-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-lg" />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-72 rounded-lg" />
        <Skeleton className="h-72 rounded-lg" />
      </div>
    </section>
  );
}

function DashboardRequiredMetrics({ dashboard }: { dashboard: BaseDashboard }) {
  const isAdmin = dashboard.role === Role.ADMIN;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardMetricCard
        label="Completed Tasks"
        value={dashboard.totalCompletedTasks}
        detail={isAdmin ? "Across all team work" : "Assigned work completed"}
        icon={<ClipboardCheck className="h-5 w-5" />}
        tone="green"
      />
      <DashboardMetricCard
        label="Active Projects"
        value={dashboard.totalActiveProjects}
        detail={isAdmin ? "Currently running" : "Projects you belong to"}
        icon={<FolderOpen className="h-5 w-5" />}
        tone="teal"
      />
      <DashboardMetricCard
        label="Weekly Worked Hours"
        value={formatHours(dashboard.weeklyWorkedHours)}
        detail="Current week"
        icon={<CalendarClock className="h-5 w-5" />}
        tone="amber"
      />
      <DashboardMetricCard
        label="Recent Activity"
        value={dashboard.recentActivity.length}
        detail="Latest tracked events"
        icon={<Activity className="h-5 w-5" />}
        tone="blue"
      />
    </div>
  );
}

interface SnapshotItem {
  label: string;
  value: string | number;
  detail?: string;
}

function DashboardSnapshot({
  title,
  items,
}: {
  title: string;
  items: SnapshotItem[];
}) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-900">{title}</p>
      <div className="mt-5 divide-y">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div>
              <p className="text-sm text-slate-600">{item.label}</p>
              {item.detail && (
                <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
              )}
            </div>
            <p className="text-lg font-semibold text-slate-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ShortcutItem {
  href: string;
  label: string;
  icon: ReactNode;
}

function DashboardShortcuts({
  title,
  items,
}: {
  title: string;
  items: ShortcutItem[];
}) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-900">{title}</p>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <Button
            key={item.href}
            asChild
            variant="outline"
            className="justify-between"
          >
            <Link href={item.href}>
              <span className="flex items-center gap-2">
                {item.icon}
                {item.label}
              </span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}

function AdminDashboardView({ dashboard }: { dashboard: AdminDashboard }) {
  return (
    <section className="flex flex-col gap-6 py-6">
      <DashboardRequiredMetrics dashboard={dashboard} />

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <DashboardSnapshot
          title="Team Operations"
          items={[
            {
              label: "Total users",
              value: dashboard.stats.totalUsers,
              detail: `${dashboard.stats.totalEmployees} employees registered`,
            },
            {
              label: "Active employees",
              value: dashboard.stats.activeEmployees,
              detail: "Employees available in the system",
            },
            {
              label: "Total tasks",
              value: dashboard.stats.totalTasks,
              detail: `${dashboard.stats.overdueTasks} overdue`,
            },
            {
              label: "Active shifts",
              value: dashboard.stats.activeShifts,
              detail: "People clocked in right now",
            },
          ]}
        />
        <DashboardShortcuts
          title="Admin Shortcuts"
          items={[
            {
              href: "/activity-logs",
              label: "View Activity Log",
              icon: <Activity className="h-4 w-4" />,
            },
            {
              href: "/users",
              label: "Manage Users",
              icon: <Users className="h-4 w-4" />,
            },
            {
              href: "/projects/create",
              label: "Create Project",
              icon: <FolderOpen className="h-4 w-4" />,
            },
            {
              href: "/shifts/create",
              label: "Add Manual Shift",
              icon: <TimerReset className="h-4 w-4" />,
            },
          ]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardSummaryCard<DashboardTaskStatus>
          title="Task Status"
          items={dashboard.taskStatusSummary}
          formatLabel={formatStatusLabel}
        />
        <DashboardSummaryCard<DashboardProjectStatus>
          title="Project Status"
          items={dashboard.projectStatusSummary}
          formatLabel={formatStatusLabel}
        />
      </div>

      <DashboardRecentActivity logs={dashboard.recentActivity} />
    </section>
  );
}

function EmployeeDashboardView({
  dashboard,
}: {
  dashboard: EmployeeDashboard;
}) {
  return (
    <section className="flex flex-col gap-6 py-6">
      <DashboardRequiredMetrics dashboard={dashboard} />

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <DashboardSnapshot
          title="My Work Snapshot"
          items={[
            {
              label: "Assigned tasks",
              value: dashboard.stats.myAssignedTasks,
              detail: `${dashboard.stats.myOpenTasks} still open`,
            },
            {
              label: "Due soon",
              value: dashboard.stats.dueSoonTasks,
              detail: "Tasks due within 7 days",
            },
            {
              label: "Overdue tasks",
              value: dashboard.stats.overdueTasks,
              detail:
                dashboard.stats.overdueTasks > 0
                  ? "Needs attention"
                  : "No overdue work",
            },
            {
              label: "Current shift",
              value: dashboard.stats.hasActiveShift ? "Active" : "Inactive",
              detail: dashboard.activeShift
                ? `Clocked in ${formatDateTime(dashboard.activeShift.clockInAt)}`
                : "Not clocked in",
            },
          ]}
        />
        <DashboardShortcuts
          title="My Work"
          items={[
            {
              href: "/tasks",
              label: "Open Tasks",
              icon: <ListChecks className="h-4 w-4" />,
            },
            {
              href: "/projects",
              label: "View Projects",
              icon: <BriefcaseBusiness className="h-4 w-4" />,
            },
            {
              href: "/shifts",
              label: "Shift Records",
              icon: <Clock3 className="h-4 w-4" />,
            },
          ]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardSummaryCard<DashboardTaskStatus>
          title="My Task Status"
          items={dashboard.taskStatusSummary}
          formatLabel={formatStatusLabel}
        />
        <DashboardSummaryCard<DashboardProjectStatus>
          title="My Project Status"
          items={dashboard.projectStatusSummary}
          formatLabel={formatStatusLabel}
        />
      </div>

      <DashboardRecentActivity logs={dashboard.recentActivity} />
    </section>
  );
}

interface DashboardPageClientProps {
  initialDashboard?: DashboardData;
}

export default function DashboardPageClient({
  initialDashboard,
}: DashboardPageClientProps) {
  const currentUser = useAppSelector((state) => state.auth.user);
  console.log({initialDashboard})
  const { data, isLoading, isError, error, refetch } = useGetDashboardQuery(undefined,{skip:!!initialDashboard});
  const loggedDashboardError = useRef(false);
  const dashboard = isSuccessResponse(data) ? data.data : initialDashboard;

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

  return (
    <>
      <div className="rounded-lg border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">
              {currentUser?.role === Role.ADMIN
                ? "WorkSync team overview"
                : "Your WorkSync overview"}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              Welcome back, {currentUser?.name ?? "there"}
            </h2>
          </div>

          <div className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
            {currentUser?.role === Role.ADMIN ? (
              <ShieldCheck className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            {currentUser?.role ?? dashboard.role}
          </div>
        </div>
      </div>

      {dashboard.role === Role.ADMIN ? (
        <AdminDashboardView dashboard={dashboard} />
      ) : (
        <EmployeeDashboardView dashboard={dashboard} />
      )}
    </>
  );
}
