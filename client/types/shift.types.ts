import type { Role } from "@/types/auth.types";

export enum ShiftStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
}
export type ShiftSortBy = "clockInAt" | "clockOutAt" | "createdAt";
export type SortOrder = "ASC" | "DESC";

export interface ShiftUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface TotalActiveShifts {
  totalActiveShifts: number;
}

export interface Shift {
  id: string;
  userId: string;
  clockInAt: string;
  clockOutAt: string | null;
  status: ShiftStatus;
  user?: ShiftUser;
  createdAt: string;
  updatedAt: string;
}

export interface ManualShiftPayload {
  userId: string;
  clockInAt: string;
  clockOutAt?: string;
}

export interface ShiftWorkedHours {
  userId: string;
  weekStart?: string;
  weekEnd?: string;
  totalMinutes: number;
  totalHours: number;
}

export interface ShiftQuery {
  page?: number;
  limit?: number;
  userId?: string;
  fromDate?: string;
  toDate?: string;
  status?: ShiftStatus;
  sortBy?: ShiftSortBy;
  sortOrder?: SortOrder;
}
