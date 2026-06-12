import type { ActivityLog } from "@/features/activity-logs/activityLogTypes";
import type { Shift } from "@/features/shifts/shiftTypes";
import { Role } from "@/enums";

export type DashboardTaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";
export type DashboardProjectStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED";

export interface DashboardSummaryItem<TStatus extends string = string> {
  status: TStatus;
  count: number;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalEmployees: number;
  activeEmployees: number;
  totalTasks: number;
  totalCompletedTasks: number;
  totalActiveProjects: number;
  totalProjects: number;
  overdueTasks: number;
  activeShifts: number;
}

export interface EmployeeDashboardStats {
  myProjects: number;
  myActiveProjects: number;
  myAssignedTasks: number;
  myOpenTasks: number;
  myCompletedTasks: number;
  overdueTasks: number;
  dueSoonTasks: number;
  hasActiveShift: boolean;
}

export interface BaseDashboard {
  role: Role;
  totalCompletedTasks: number;
  totalActiveProjects: number;
  weeklyWorkedHours: number;
  taskStatusSummary: DashboardSummaryItem<DashboardTaskStatus>[];
  projectStatusSummary: DashboardSummaryItem<DashboardProjectStatus>[];
  recentActivity: ActivityLog[];
}

export interface AdminDashboard extends BaseDashboard {
  role: Role.ADMIN;
  stats: AdminDashboardStats;
}

export interface EmployeeDashboard extends BaseDashboard {
  role: Role.EMPLOYEE;
  stats: EmployeeDashboardStats;
  activeShift: Shift | null;
}

export type DashboardData = AdminDashboard | EmployeeDashboard;
