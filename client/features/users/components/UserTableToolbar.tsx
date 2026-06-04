"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/features/auth/authTypes";
import { useGetDepartmentQuery } from "@/features/departments/departmentsApi";
import { isSuccessResponse } from "@/types/api-response";

interface UserTableToolbarProps {
  search: string;
  role: UserRole | "all";
  departmentId: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: UserRole | "all") => void;
  onDepartmentChange: (value: string) => void;
  onReset: () => void;
}

export function UsersTableToolbar({
  search,
  role,
  departmentId,
  onSearchChange,
  onRoleChange,
  onDepartmentChange,
  onReset,
}: UserTableToolbarProps) {
  const hasFilters =
    search.length > 0 || role !== 'all' || departmentId !== 'all';
  const { data, isLoading } = useGetDepartmentQuery();

  const departments = isSuccessResponse(data) ? (data?.data ?? []) : [];
  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search users..."
          className="pl-9"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select
          value={role}
          onValueChange={onRoleChange}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="EMPLOYEE">Employee</SelectItem>
          </SelectContent>
        </Select>
        <Select
          disabled={isLoading}
          value={departmentId}
          onValueChange={onDepartmentChange}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Departments" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((department) => (
              <SelectItem key={department.id} value={department.id}>
                {department.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="outline" onClick={onReset}>
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
