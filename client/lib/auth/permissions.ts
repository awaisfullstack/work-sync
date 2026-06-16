import { Role } from "@/types/auth.types";
import type { AuthUser } from "@/types/auth.types";

export function isAdmin(user: AuthUser | null | undefined) {
  return user?.role === Role.ADMIN;
}

export function canManageProjectMembers(user: AuthUser | null | undefined) {
  return isAdmin(user);
}

export function canEditProject(user: AuthUser | null | undefined) {
  return isAdmin(user);
}
