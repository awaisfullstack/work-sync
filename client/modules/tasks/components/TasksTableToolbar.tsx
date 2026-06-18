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
import type { DateRange } from "react-day-picker";
import { useGetProjectOptionsQuery } from "@/store/api/projectsApi";
import { DateRangePicker } from "@/components/common/DateRangePicker";
import type { SortOrder, TaskSortBy, TaskStatus } from "@/types/task.types";

interface TasksTableToolbarProps {
  projectId: string;
  search: string;
  status: TaskStatus | "ALL";
  sortBy: TaskSortBy;
  sortOrder: SortOrder;
  dateRange?: DateRange;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TaskStatus | "ALL") => void;
  onSortByChange: (value: TaskSortBy) => void;
  onSortOrderChange: (value: SortOrder) => void;
  onProjectIdChange: (value: string) => void;
  onDateRangeChange: (value: DateRange | undefined) => void;
  onReset: () => void;
}

export function TasksTableToolbar({
  search,
  projectId,
  status,
  sortBy,
  sortOrder,
  dateRange,
  onSearchChange,
  onStatusChange,
  onSortByChange,
  onDateRangeChange,
  onSortOrderChange,
  onProjectIdChange,
  onReset,
}: TasksTableToolbarProps) {
  const hasFilters =
    search.length > 0 ||
    dateRange !== undefined ||
    projectId !== "all" ||
    status !== "ALL" ||
    sortBy !== "createdAt" ||
    sortOrder !== "DESC";

  const { data, isLoading } = useGetProjectOptionsQuery();

  const allProjects = data?.data ?? [];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm xl:flex-row xl:flex-wrap xl:items-center xl:justify-between">
      <div className="relative w-full xl:max-w-sm xl:shrink-0">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-9"
        />
      </div>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:flex xl:w-auto xl:flex-wrap xl:items-center">
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full xl:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="TODO">To Do</SelectItem>
          </SelectContent>
        </Select>

        <Select
          disabled={isLoading}
          value={projectId}
          onValueChange={onProjectIdChange}
        >
          <SelectTrigger className="w-full xl:w-[220px]">
            <SelectValue placeholder="Projects" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {allProjects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-full xl:w-[190px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="createdAt">Latest Created</SelectItem>
            <SelectItem value="updatedAt">Recently Updated</SelectItem>
            <SelectItem value="dueDate">Due Date</SelectItem>
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
          className="w-full xl:w-[260px]"
          placeholder="Filter by due date"
        />

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
