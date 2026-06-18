"use client";

type LogLevel = "debug" | "info" | "warn" | "error";

type LogDetails = Record<string, unknown>;

type LogOptions = {
  source: string;
  metadata?: LogDetails;
};

type LogInput = LogOptions & {
  level: LogLevel;
  message: string;
};

function currentRoute() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return `${window.location.pathname}${window.location.search}`;
}

function formatError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }

  return error;
}

export async function logFrontendEvent(input: LogInput) {
  const details = {
    route: currentRoute(),
    ...input.metadata,
  };

  try {
    await fetch("/api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        level: input.level,
        message: input.message,
        source: input.source,
        details,
      }),
      keepalive: true,
    });
  } catch (error) {
    console.error("Failed to send frontend log", error);
  }
}

export function logFrontendError(
  message: string,
  error: unknown,
  options: LogOptions,
) {
  return logFrontendEvent({
    ...options,
    level: "error",
    message,
    metadata: {
      ...options.metadata,
      error: formatError(error),
    },
  });
}

export function logFrontendValidationIssue(
  message: string,
  options: LogOptions,
) {
  return logFrontendEvent({
    ...options,
    level: "warn",
    message,
  });
}
