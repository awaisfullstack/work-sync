import type { Role } from "@/enums";

export type ShiftStatus = "ACTIVE" | "COMPLETED";
export type ShiftSortBy = "clockInAt" | "clockOutAt" | "createdAt";
export type SortOrder = "ASC" | "DESC";

export interface ShiftUser {
  id: string;
  name: string;
  email: string;
  role: Role;
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
  clockOutAt: string;
}

export interface ShiftWorkedHours {
  userId: string;
  fromDate?: string | null;
  toDate?: string | null;
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
