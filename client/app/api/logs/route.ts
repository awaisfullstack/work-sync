import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOG_DIR = path.join(process.cwd(), "storage", "logs");
const LOG_FILE = path.join(LOG_DIR, "frontend-logs.jsonl");
const LOG_LEVELS = ["debug", "info", "warn", "error"] as const;

type LogLevel = (typeof LOG_LEVELS)[number];

type StoredLog = {
  id: string;
  level: LogLevel;
  message: string;
  source?: string;
  route?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  userAgent: string | null;
};

function response(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isLogLevel(value: unknown): value is LogLevel {
  return typeof value === "string" && LOG_LEVELS.includes(value as LogLevel);
}

function cleanString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

async function saveLog(log: StoredLog) {
  await mkdir(LOG_DIR, { recursive: true });
  await appendFile(LOG_FILE, `${JSON.stringify(log)}\n`, "utf8");
}

async function getRecentLogs(limit: number) {
  try {
    const file = await readFile(LOG_FILE, "utf8");

    return file
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line) as StoredLog;
        } catch {
          return null;
        }
      })
      .filter((log): log is StoredLog => Boolean(log))
      .slice(-limit)
      .reverse();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return response({ success: false, message: "Invalid JSON body." }, 400);
  }

  if (!isObject(body)) {
    return response({ success: false, message: "Body must be an object." }, 400);
  }

  const level = body.level;
  const message = cleanString(body.message);

  if (!isLogLevel(level)) {
    return response(
      { success: false, message: "Level must be debug, info, warn, or error." },
      400,
    );
  }

  if (!message) {
    return response({ success: false, message: "Message is required." }, 400);
  }

  const log: StoredLog = {
    id: crypto.randomUUID(),
    level,
    message,
    source: cleanString(body.source),
    route: cleanString(body.route),
    userId: cleanString(body.userId),
    sessionId: cleanString(body.sessionId),
    metadata: isObject(body.metadata) ? body.metadata : undefined,
    createdAt: new Date().toISOString(),
    userAgent: request.headers.get("user-agent"),
  };

  try {
    await saveLog(log);
  } catch {
    return response({ success: false, message: "Could not save log." }, 500);
  }

  return response(
    {
      success: true,
      message: "Log saved.",
      data: {
        id: log.id,
        createdAt: log.createdAt,
      },
    },
    201,
  );
}

export async function GET(request: NextRequest) {
  const limitValue = Number(request.nextUrl.searchParams.get("limit") ?? 25);
  const limit = Number.isFinite(limitValue)
    ? Math.min(Math.max(limitValue, 1), 100)
    : 25;

  try {
    const logs = await getRecentLogs(limit);

    return response({
      success: true,
      message: "Logs fetched.",
      data: {
        items: logs,
        count: logs.length,
      },
    });
  } catch {
    return response({ success: false, message: "Could not read logs." }, 500);
  }
}
