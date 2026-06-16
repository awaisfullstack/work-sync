import { Role } from "@/types/auth.types";

export interface UserDepartment {
  id: string;
  name: string;
}

export interface UserOption {
  id: string;
  name: string;
  email: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  departmentId?: string | null;

  department?: UserDepartment | null;
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
  role: Role;
  departmentId: string | null;
}

export type UpdateUserPayload = Partial<Omit<CreateUserRequest, "password">>;

export interface UpdateUserRequest {
  id: string;
  body: UpdateUserPayload;
}

export interface UsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  departmentId?: string;
}
