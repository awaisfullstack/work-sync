"use client";

import { useEffect } from "react";

import { logFrontendError } from "@/lib/logger/frontendLogger";

export function FrontendErrorLogger() {
  useEffect(() => {
    function handleWindowError(event: ErrorEvent) {
      void logFrontendError(
        "Unexpected frontend crash",
        event.error ?? event.message,
        {
          source: "window.error",
          metadata: {
            filename: event.filename,
            lineNumber: event.lineno,
            columnNumber: event.colno,
          },
        },
      );
    }

    function handleUnhandledRejection(event: PromiseRejectionEvent) {
      void logFrontendError(
        "Unexpected frontend promise rejection",
        event.reason,
        {
          source: "window.unhandledrejection",
        },
      );
    }

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  return null;
}
