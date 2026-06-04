"use client";

import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="h-8 w-8" />
        <p className="text-sm font-medium text-slate-500">Loading...</p>
      </div>
    </div>
  );
}
