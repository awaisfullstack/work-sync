import type { UserRole } from "@/features/auth/authTypes";

export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED";
export type ProjectMemberRole = "MEMBER" | "LEAD";
export type ProjectSortBy = "createdAt" | "updatedAt" | "deadline" | "title";

export type SortOrder = "ASC" | "DESC";
export interface ProjectUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface ProjectOption {
  id: string;
  title: string;
}

export interface ProjectMemberUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: {
    id: string;
    name: string;
  } | null;
}

export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  roleInProject: ProjectMemberRole;
  joinedAt: string;
  user?: ProjectMemberUser;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectTaskSummary {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  dueDate: string;
  assignedUser?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  deadline: string;
  createdById: string;
  createdBy: ProjectUser;
  archivedAt?: string | null;
  members?: ProjectMember[];
  membersCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProjectStatus | "";
  sortBy?: ProjectSortBy;
  sortOrder?: SortOrder;
}

export interface CreateProjectPayload {
  title: string;
  description: string;
  status: ProjectStatus;
  deadline: string;
}

export interface UpdateProjectPayload {
  title?: string;
  description?: string;
  status?: ProjectStatus;
  deadline?: string;
}

export interface AssignProjectMemberPayload {
  projectId: string;
  userId: string;
  roleInProject: ProjectMemberRole;
}

export interface RemoveProjectMemberPayload {
  projectId: string;
  userId: string;
}
