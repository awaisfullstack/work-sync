"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FolderOpen,
  ListChecks,
  ShieldCheck,
  Users,
} from "lucide-react";

import LoadTableError from "@/components/shared/LoadTableError";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Role } from "@/constants";
import { useAppSelector } from "@/store/hooks";
import { isSuccessResponse } from "@/types/api-response";
import { useGetDashboardQuery } from "../dashboardApi";
import type {
  AdminDashboard,
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
          <Skeleton key={index} className="h-32 rounded-2xl" />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </section>
  );
}

function AdminDashboardView({ dashboard }: { dashboard: AdminDashboard }) {
  return (
    <section className="flex flex-col gap-6 py-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard
          label="Total Users"
          value={dashboard.stats.totalUsers}
          detail={`${dashboard.stats.activeEmployees} active employees`}
          icon={<Users className="h-5 w-5" />}
          tone="blue"
        />
        <DashboardMetricCard
          label="Active Projects"
          value={dashboard.stats.totalActiveProjects}
          detail={`${dashboard.stats.totalProjects} projects total`}
          icon={<FolderOpen className="h-5 w-5" />}
          tone="green"
        />
        <DashboardMetricCard
          label="Total Tasks"
          value={dashboard.stats.totalTasks}
          detail={`${dashboard.stats.totalCompletedTasks} completed`}
          icon={<ListChecks className="h-5 w-5" />}
          tone="slate"
        />
        <DashboardMetricCard
          label="Weekly Hours"
          value={formatHours(dashboard.weeklyWorkedHours)}
          detail={`${dashboard.stats.activeShifts} active shifts`}
          icon={<CalendarClock className="h-5 w-5" />}
          tone="amber"
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

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <DashboardRecentActivity logs={dashboard.recentActivity} />

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-900">Admin Shortcuts</p>
          <div className="mt-4 grid gap-3">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/activity-logs">View Activity Log</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/users">Manage Users</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/projects/create">Create Project</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/shifts/create">Add Manual Shift</Link>
            </Button>
          </div>
        </div>
      </div>
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard
          label="My Projects"
          value={dashboard.stats.myProjects}
          detail={`${dashboard.stats.myActiveProjects} active projects`}
          icon={<BriefcaseBusiness className="h-5 w-5" />}
          tone="blue"
        />
        <DashboardMetricCard
          label="Assigned Tasks"
          value={dashboard.stats.myAssignedTasks}
          detail={`${dashboard.stats.myOpenTasks} open tasks`}
          icon={<ListChecks className="h-5 w-5" />}
          tone="slate"
        />
        <DashboardMetricCard
          label="Due Soon"
          value={dashboard.stats.dueSoonTasks}
          detail={`${dashboard.stats.overdueTasks} overdue`}
          icon={<Clock3 className="h-5 w-5" />}
          tone={dashboard.stats.overdueTasks > 0 ? "rose" : "amber"}
        />
        <DashboardMetricCard
          label="Weekly Hours"
          value={formatHours(dashboard.weeklyWorkedHours)}
          detail={
            dashboard.stats.hasActiveShift
              ? "Shift currently active"
              : "No active shift"
          }
          icon={<CalendarClock className="h-5 w-5" />}
          tone="green"
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

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <DashboardRecentActivity logs={dashboard.recentActivity} />

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-900">My Work</p>
          <div className="mt-4 grid gap-3">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/tasks">Open Tasks</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/projects">View Projects</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/shifts">Shift Records</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DashboardPageClient() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError, refetch } = useGetDashboardQuery();
  const dashboard = isSuccessResponse(data) ? data.data : undefined;

  if (isLoading) {
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
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">
              {currentUser?.role === Role.ADMIN
                ? "Organization overview"
                : "Your work overview"}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              Welcome back, {currentUser?.name ?? "there"}
            </h2>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
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
