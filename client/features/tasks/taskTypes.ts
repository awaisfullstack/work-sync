import type { UserRole } from "@/features/auth/authTypes";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";

export type TaskSortBy = "createdAt" | "updatedAt" | "dueDate" | "title";

export type SortOrder = "ASC" | "DESC";

export interface TaskUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string;
  projectId: string;
  createdBy: string;
  creator: TaskUser;
  createdAt: string;
  updatedAt: string;
}

export interface TaskQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus | "";
  sortBy?: TaskSortBy;
  sortOrder?: SortOrder;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
}

