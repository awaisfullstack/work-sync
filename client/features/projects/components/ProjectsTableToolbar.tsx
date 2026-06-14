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

import { ProjectSortBy, ProjectStatus, SortOrder } from "../projectTypes";

interface ProjectsTableToolbarProps {
  search: string;
  status: ProjectStatus | "ALL";
  sortBy: ProjectSortBy;
  sortOrder: SortOrder;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ProjectStatus | "ALL") => void;
  onSortByChange: (value: ProjectSortBy) => void;
  onSortOrderChange: (value: SortOrder) => void;
  onReset: () => void;
}

export function ProjectsTableToolbar({
  search,
  status,
  sortBy,
  sortOrder,
  onSearchChange,
  onStatusChange,
  onSortByChange,
  onSortOrderChange,
  onReset,
}: ProjectsTableToolbarProps) {
  const hasFilters =
    search.length > 0 ||
    status !== "ALL" ||
    sortBy !== "createdAt" ||
    sortOrder !== "DESC";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm xl:flex-row xl:flex-wrap xl:items-center xl:justify-between">
      <div className="relative w-full xl:max-w-sm xl:flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search projects..."
          className="w-full pl-9"
        />
      </div>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:flex xl:w-auto xl:flex-wrap xl:items-center xl:justify-end">
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full xl:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            {Object.values(ProjectStatus).map((projectStatus) => (
              <SelectItem key={projectStatus} value={projectStatus}>
                {projectStatus[0] +
                  projectStatus.slice(1).toLowerCase()}
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
            <SelectItem value="deadline">Deadline</SelectItem>
            <SelectItem value="title">Title</SelectItem>
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
