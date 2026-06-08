"use client";

import { useEffect } from "react";

import { logFrontendError } from "@/lib/logger/frontendLogger";

export default function Error({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    void logFrontendError("Unexpected frontend crash", error, {
      source: "next-error-boundary",
      metadata: {
        digest: error.digest ?? null,
      },
    });
  }, [error]);

  return (
    <div className="main-container min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold mb-1">Something went wrong!</h1>
      <p>Try refreshing the page or contact support if the issue persists.</p>
    </div>
  );
}
