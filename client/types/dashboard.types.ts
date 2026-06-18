import type { ActivityLog } from "@/types/activity-log.types";
import type { Shift } from "@/types/shift.types";
import { Role } from "@/types/auth.types";

export interface DashboardBase {
  role: Role;
  completedTasks: number;
  activeProjects: number;
  weeklyWorkedHours: number;
  recentActivity: ActivityLog[];
}

export interface AdminDashboard extends DashboardBase {
  role: Role.ADMIN;
  stats: {
    totalUsers: number;
    totalEmployees: number;
    totalTasks: number;
    totalProjects: number;
    activeShifts: number;
    overdueTasks: number;
  };
}

export interface EmployeeDashboard extends DashboardBase {
  role: Role.EMPLOYEE;
  stats: {
    myProjects: number;
    assignedTasks: number;
    openTasks: number;
    overdueTasks: number;
    dueSoonTasks: number;
    hasActiveShift: boolean;
  };
  activeShift: Shift | null;
}

export type DashboardData = AdminDashboard | EmployeeDashboard;
