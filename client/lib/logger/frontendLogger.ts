"use client";

type FrontendLogLevel = "debug" | "info" | "warn" | "error";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

interface FrontendLogInput {
  level: FrontendLogLevel;
  message: string;
  source: string;
  route?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, JsonValue>;
}

function getCurrentRoute() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return `${window.location.pathname}${window.location.search}`;
}

function toJsonValue(value: unknown, depth = 0): JsonValue {
  if (depth > 4) {
    return "[Max depth reached]";
  }

  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : String(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => toJsonValue(item, depth + 1));
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack ?? null,
    };
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        toJsonValue(item, depth + 1),
      ]),
    );
  }

  return String(value);
}

function sanitizeMetadata(metadata?: Record<string, unknown>) {
  if (!metadata) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => [key, toJsonValue(value)]),
  );
}

export async function logFrontendEvent(input: FrontendLogInput) {
  const payload: FrontendLogInput = {
    ...input,
    route: input.route ?? getCurrentRoute(),
  };

  try {
    const response = await fetch("/api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });

    if (!response.ok) {
      console.error("Failed to store frontend log", {
        status: response.status,
        payload,
      });
    }
  } catch (error) {
    console.error("Failed to send frontend log", error);
  }
}

export function logFrontendError(
  message: string,
  error: unknown,
  options: Omit<FrontendLogInput, "level" | "message" | "metadata"> & {
    metadata?: Record<string, unknown>;
  },
) {
  return logFrontendEvent({
    ...options,
    level: "error",
    message,
    metadata: sanitizeMetadata({
      ...options.metadata,
      error,
    }),
  });
}

export function logFrontendValidationIssue(
  message: string,
  options: Omit<FrontendLogInput, "level" | "message" | "metadata"> & {
    metadata?: Record<string, unknown>;
  },
) {
  return logFrontendEvent({
    ...options,
    level: "warn",
    message,
    metadata: sanitizeMetadata(options.metadata),
  });
}
