import { Role } from "@/enums";
import type { AuthUser } from "@/features/auth/authTypes";

export function isAdmin(user: AuthUser | null | undefined) {
  return user?.role === Role.ADMIN;
}

export function canManageProjectMembers(user: AuthUser | null | undefined) {
  return isAdmin(user);
}

export function canEditProject(user: AuthUser | null | undefined) {
  return isAdmin(user);
}
