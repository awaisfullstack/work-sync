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
    <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search departments..."
          className="pl-9"
        />
      </div>

      {hasFilters && (
        <Button variant="outline" onClick={onReset}>
          <X className="mr-2 h-4 w-4" />
          Reset
        </Button>
      )}
    </div>
  );
}
