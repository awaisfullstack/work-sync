export type UserRole = "ADMIN" | "EMPLOYEE";

export interface Department {
  id: string;
  name: string;
}

export interface UserOption {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId?: string | null;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  department: Department | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponseData {
  user: AuthUser;
}


