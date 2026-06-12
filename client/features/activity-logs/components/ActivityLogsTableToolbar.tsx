"use client";

import { X } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@/constants";
import type { AuthUser } from "@/features/auth/authTypes";
import { useGetProjectOptionsQuery } from "@/features/projects/projectsApi";
import { useGetUserOptionsQuery } from "@/features/users/usersApi";
import { isSuccessResponse } from "@/types/api-response";
import {
  ActivityAction,
  ActivityEntityType,
  type ActivitySortBy,
  type SortOrder,
} from "../activityLogTypes";
import {
  formatActivityLabel,
} from "../utils";

interface ActivityLogsTableToolbarProps {
  user: AuthUser | null;
  action: ActivityAction | "ALL";
  entityType: ActivityEntityType | "ALL";
  actorId: string;
  projectId: string;
  sortBy: ActivitySortBy;
  sortOrder: SortOrder;
  dateRange?: DateRange;
  onActionChange: (value: ActivityAction | "ALL") => void;
  onEntityTypeChange: (value: ActivityEntityType | "ALL") => void;
  onActorIdChange: (value: string) => void;
  onProjectIdChange: (value: string) => void;
  onSortByChange: (value: ActivitySortBy) => void;
  onSortOrderChange: (value: SortOrder) => void;
  onDateRangeChange: (value: DateRange | undefined) => void;
  onReset: () => void;
}

export function ActivityLogsTableToolbar({
  user,
  action,
  entityType,
  actorId,
  projectId,
  sortBy,
  sortOrder,
  dateRange,
  onActionChange,
  onEntityTypeChange,
  onActorIdChange,
  onProjectIdChange,
  onSortByChange,
  onSortOrderChange,
  onDateRangeChange,
  onReset,
}: ActivityLogsTableToolbarProps) {
  const isAdmin = user?.role === Role.ADMIN;
  const { data: usersResponse, isLoading: isUsersLoading } =
    useGetUserOptionsQuery(undefined, {
      skip: !isAdmin,
    });
  const { data: projectsResponse, isLoading: isProjectsLoading } =
    useGetProjectOptionsQuery();

  const users = isSuccessResponse(usersResponse) ? usersResponse.data : [];
  const projects = isSuccessResponse(projectsResponse)
    ? projectsResponse.data
    : [];
  const hasFilters =
    action !== "ALL" ||
    entityType !== "ALL" ||
    (isAdmin && actorId !== "all") ||
    projectId !== "all" ||
    dateRange !== undefined ||
    sortBy !== "createdAt" ||
    sortOrder !== "DESC";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm">
      <div className="w-full">
        <p className="text-sm font-medium text-slate-900">Audit Trail</p>
        <p className="mt-1 text-sm text-slate-500">
          {isAdmin
            ? "Filter activity by actor, project, action, entity, date, and order."
            : "Review your activity by project, action, entity, date, and order."}
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:flex xl:w-auto xl:flex-wrap xl:items-center">
        {isAdmin && (
          <Select value={actorId} onValueChange={onActorIdChange}>
            <SelectTrigger
              disabled={isUsersLoading}
              className="w-full xl:w-[190px]"
            >
              <SelectValue placeholder="Actor" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Actors</SelectItem>
              {users.map((userOption) => (
                <SelectItem key={userOption.id} value={userOption.id}>
                  {userOption.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={projectId} onValueChange={onProjectIdChange}>
          <SelectTrigger
            disabled={isProjectsLoading}
            className="w-full xl:w-[190px]"
          >
            <SelectValue placeholder="Project" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={action} onValueChange={onActionChange}>
          <SelectTrigger className="w-full xl:w-[210px]">
            <SelectValue placeholder="Action" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All Actions</SelectItem>
            {Object.values(ActivityAction).map((actionOption) => (
              <SelectItem key={actionOption} value={actionOption}>
                {formatActivityLabel(actionOption)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={entityType} onValueChange={onEntityTypeChange}>
          <SelectTrigger className="w-full xl:w-[180px]">
            <SelectValue placeholder="Entity" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All Entities</SelectItem>
            {Object.values(ActivityEntityType).map((entityTypeOption) => (
              <SelectItem key={entityTypeOption} value={entityTypeOption}>
                {formatActivityLabel(entityTypeOption)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-full xl:w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="createdAt">Created</SelectItem>
            <SelectItem value="updatedAt">Updated</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortOrder} onValueChange={onSortOrderChange}>
          <SelectTrigger className="w-full xl:w-[150px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="DESC">Descending</SelectItem>
            <SelectItem value="ASC">Ascending</SelectItem>
          </SelectContent>
        </Select>

        <DateRangePicker
          value={dateRange}
          onChange={onDateRangeChange}
          className="w-full sm:col-span-2 lg:col-span-1 xl:w-[260px]"
          placeholder="Filter by log date"
        />

        {hasFilters && (
          <Button
            variant="outline"
            onClick={onReset}
            className="w-full sm:col-span-2 lg:col-span-1 xl:w-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
