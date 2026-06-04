import { Department, UserRole } from "../auth/authTypes";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  departmentId: string | null;
  createdAt: string;
  updatedAt: string;

  department?: Department | null;
}

export interface UsersStats {
  totalUsers: number;
  totalAdmins: number;
  totalEmployees: number;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  departmentId: string | null;
}

export interface UpdateUserRequest {
  id: string;
  body: Partial<Omit<CreateUserRequest, "password">> & {
    password?: string;
  };
}

export interface UsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole | "";
  departmentId?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}
