"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DepartmentsTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onReset: () => void;
}

export function DepartmentsTableToolbar({
  search,
  onSearchChange,
  onReset,
}: DepartmentsTableToolbarProps) {
  const hasFilters = search.length > 0;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm sm:flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value.trim())}
          placeholder="Search departments..."
          className="w-full pl-9"
        />
      </div>

      {hasFilters && (
        <Button variant="outline" onClick={onReset} className="w-full sm:w-auto">
          <X className="mr-2 h-4 w-4" />
          Reset
        </Button>
      )}
    </div>
  );
}
