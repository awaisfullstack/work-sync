import { Role } from "@/enums";
import type { UserDepartment } from "../users/userTypes";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  department: UserDepartment | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponseData {
  user: AuthUser;
}


