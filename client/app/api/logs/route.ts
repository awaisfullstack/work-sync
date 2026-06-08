import { mkdir, readFile, appendFile } from "node:fs/promises";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOG_STORAGE_DIR = path.join(process.cwd(), "storage", "logs");
const LOG_STORAGE_FILE = path.join(LOG_STORAGE_DIR, "frontend-logs.jsonl");
const MAX_RECENT_LOGS = 100;

const logLevelSchema = z.enum(["debug", "info", "warn", "error"]);

const frontendLogSchema = z.object({
  level: logLevelSchema,
  message: z.string().trim().min(1).max(1000),
  timestamp: z
    .string()
    .datetime({ offset: true })
    .optional(),
  source: z.string().trim().max(120).optional(),
  route: z.string().trim().max(250).optional(),
  userId: z.string().trim().max(120).optional(),
  sessionId: z.string().trim().max(120).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
}).strict();

const logsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(MAX_RECENT_LOGS).default(25),
  level: logLevelSchema.optional(),
  source: z.string().trim().min(1).max(120).optional(),
  route: z.string().trim().min(1).max(250).optional(),
  userId: z.string().trim().min(1).max(120).optional(),
}).strict();

type FrontendLogPayload = z.infer<typeof frontendLogSchema>;
type LogLevel = z.infer<typeof logLevelSchema>;

interface StoredFrontendLog extends FrontendLogPayload {
  id: string;
  receivedAt: string;
  request: {
    ip: string | null;
    userAgent: string | null;
  };
}

function apiResponse<T>(
  body: {
    success: boolean;
    message: string;
    data?: T;
    errors?: unknown;
  },
  status: number,
) {
  return NextResponse.json(body, { status });
}

function validationErrorResponse(
  message: string,
  errors: unknown,
  status = 422,
) {
  return apiResponse(
    {
      success: false,
      message,
      errors,
    },
    status,
  );
}

function isJsonRequest(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";

  return (
    contentType.includes("application/json") ||
    contentType.includes("+json")
  );
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (!forwardedFor) {
    return request.headers.get("x-real-ip");
  }

  return forwardedFor.split(",")[0]?.trim() || null;
}

async function ensureLogStorage() {
  await mkdir(LOG_STORAGE_DIR, { recursive: true });
}

async function storeLog(log: StoredFrontendLog) {
  await ensureLogStorage();
  await appendFile(LOG_STORAGE_FILE, `${JSON.stringify(log)}\n`, "utf8");
}

async function readLogs(filters: {
  limit: number;
  level?: LogLevel;
  source?: string;
  route?: string;
  userId?: string;
}) {
  try {
    const content = await readFile(LOG_STORAGE_FILE, "utf8");
    const logs = content
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line) as StoredFrontendLog;
        } catch {
          return null;
        }
      })
      .filter((log): log is StoredFrontendLog => Boolean(log))
      .filter((log) => {
        if (filters.level && log.level !== filters.level) {
          return false;
        }

        if (filters.source && log.source !== filters.source) {
          return false;
        }

        if (filters.route && log.route !== filters.route) {
          return false;
        }

        if (filters.userId && log.userId !== filters.userId) {
          return false;
        }

        return true;
      })
      .slice(-filters.limit)
      .reverse();

    return logs;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export async function POST(request: NextRequest) {
  if (!isJsonRequest(request)) {
    return apiResponse(
      {
        success: false,
        message: "Content-Type must be application/json.",
      },
      415,
    );
  }

  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return apiResponse(
      {
        success: false,
        message: "Invalid JSON body.",
      },
      400,
    );
  }

  const parsed = frontendLogSchema.safeParse(json);

  if (!parsed.success) {
    return validationErrorResponse(
      "Invalid frontend log payload.",
      parsed.error.flatten(),
    );
  }

  const receivedAt = new Date().toISOString();
  const storedLog: StoredFrontendLog = {
    ...parsed.data,
    timestamp: parsed.data.timestamp ?? receivedAt,
    id: crypto.randomUUID(),
    receivedAt,
    request: {
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent"),
    },
  };

  try {
    await storeLog(storedLog);
  } catch {
    return apiResponse(
      {
        success: false,
        message: "Failed to store frontend log.",
      },
      500,
    );
  }

  return apiResponse(
    {
      success: true,
      message: "Frontend log stored successfully.",
      data: {
        id: storedLog.id,
        receivedAt: storedLog.receivedAt,
      },
    },
    201,
  );
}

export async function GET(request: NextRequest) {
  const query = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsedQuery = logsQuerySchema.safeParse(query);

  if (!parsedQuery.success) {
    return validationErrorResponse(
      "Invalid frontend logs query.",
      parsedQuery.error.flatten(),
      400,
    );
  }

  try {
    const filters = parsedQuery.data;
    const logs = await readLogs(filters);

    return apiResponse(
      {
        success: true,
        message: "Frontend logs fetched successfully.",
        data: {
          items: logs,
          filters,
          count: logs.length,
        },
      },
      200,
    );
  } catch {
    return apiResponse(
      {
        success: false,
        message: "Failed to fetch frontend logs.",
      },
      500,
    );
  }
}
