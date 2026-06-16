import type { Role } from "@/types/auth.types";

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export type TaskSortBy = "createdAt" | "updatedAt" | "dueDate";

export type SortOrder = "ASC" | "DESC";

export interface Status {
  id: string;
  name: TaskStatus;
}

export interface TaskUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  comment: string;
  createdAt: string;
  updatedAt?: string;

  user?: TaskUser;
}

export interface TaskProjectSummary {
  id: string;
  title: string;
}

export interface TaskAssignment {
  id: string;
  taskId: string;
  userId: string;
  assignedBy: string;
  assignedAt: string;
  unassignedAt?: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  dueDate: string;
  projectId?: string;
  project: TaskProjectSummary;
  assignments?: TaskAssignment[];
  creator: TaskUser;
  createdAt: string;
  updatedAt: string;

  comments?: TaskComment[];
}

export interface TaskQuery {
  page?: number;
  limit?: number;
  search?: string;
  projectId?: string;
  startDate?: string;
  endDate?: string;
  status?: TaskStatus;
  sortBy?: TaskSortBy;
  sortOrder?: SortOrder;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  dueDate: string;
  projectId: string;
  status: TaskStatus;
}

export interface CreateTaskCommentRequest {
  taskId: string;
  comment: string;
}

export type UpdateTaskPayload = Partial<Omit<CreateTaskPayload, "projectId">>;

export interface UpdateTaskRequest {
  id: string;
  body: UpdateTaskPayload;
}

export interface UpdateTaskStatusPayload {
  id: string;
  status: TaskStatus;
}

export interface AssignTaskPayload {
  id: string;
  userId: string;
}
