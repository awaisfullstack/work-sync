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
import type { Role } from "@/types/auth.types";
import { useGetDepartmentQuery } from "@/store/api/departmentsApi";

interface UserTableToolbarProps {
  search: string;
  role: Role | "all";
  departmentId: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: Role | "all") => void;
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

  const departments = data?.data ?? [];
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm xl:flex-row xl:flex-wrap xl:items-center xl:justify-between">
      <div className="relative w-full xl:max-w-sm xl:flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search users..."
          className="w-full pl-9"
        />
      </div>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 xl:flex xl:w-auto xl:flex-wrap xl:items-center xl:justify-end">
        <Select value={role} onValueChange={onRoleChange}>
          <SelectTrigger className="w-full xl:w-[160px]">
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
          <SelectTrigger className="w-full xl:w-[190px]">
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
          <Button
            variant="outline"
            onClick={onReset}
            className="w-full xl:w-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
