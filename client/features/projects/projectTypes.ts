import type { UserRole } from "@/features/auth/authTypes";

export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED";

export interface ProjectUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  user?: ProjectUser;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  deadline: string | null;
  createdById: string;
  createdBy: ProjectUser;
  archivedAt: string | null;
  members?: ProjectMember[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProjectStatus | "";
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
}
