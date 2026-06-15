import type { Role } from "@/enums";

export enum ProjectStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
}

export enum ProjectMemberRole {
  MEMBER = "MEMBER",
  LEAD = "LEAD",
}

export type ProjectSortBy = "createdAt" | "updatedAt" | "deadline" | "title";

export type SortOrder = "ASC" | "DESC";
export interface ProjectUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface ProjectOption {
  id: string;
  title: string;
}

export interface ProjectMemberUser {
  id: string;
  name: string;
  email: string;
  role: Role;
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
  user: ProjectMemberUser;
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
  membersCount: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProjectStatus;
  sortBy?: ProjectSortBy;
  sortOrder?: SortOrder;
}

export interface CreateProjectPayload {
  title: string;
  description?: string;
  status?: ProjectStatus;
  deadline?: string | null;
}

export type UpdateProjectPayload = Partial<CreateProjectPayload>;

export interface UpdateProjectRequest {
  id: string;
  body: UpdateProjectPayload;
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
