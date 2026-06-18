import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOG_DIR = path.join(process.cwd(), "storage", "logs");
const LOG_FILE = path.join(LOG_DIR, "frontend-logs.jsonl");
const LOG_LEVELS = ["debug", "info", "warn", "error"] as const;

type LogLevel = (typeof LOG_LEVELS)[number];

type LogBody = {
  level?: unknown;
  message?: unknown;
  source?: unknown;
  details?: unknown;
};

type StoredLog = {
  createdAt: string;
  level: LogLevel;
  message: string;
  source?: string;
  details?: Record<string, unknown>;
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isLogLevel(value: unknown): value is LogLevel {
  return typeof value === "string" && LOG_LEVELS.includes(value as LogLevel);
}

function cleanText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

async function saveLog(log: StoredLog) {
  await mkdir(LOG_DIR, { recursive: true });
  await appendFile(LOG_FILE, `${JSON.stringify(log)}\n`, "utf8");
}

async function readLogs(limit: number) {
  try {
    const file = await readFile(LOG_FILE, "utf8");

    return file
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as StoredLog)
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
  let body: LogBody;

  try {
    const data = await request.json();
    body = isObject(data) ? data : {};
  } catch {
    return json({ success: false, message: "Invalid JSON body." }, 400);
  }

  const message = cleanText(body.message);

  if (!isLogLevel(body.level)) {
    return json({ success: false, message: "Invalid log level." }, 400);
  }

  if (!message) {
    return json({ success: false, message: "Message is required." }, 400);
  }

  const log: StoredLog = {
    createdAt: new Date().toISOString(),
    level: body.level,
    message,
    source: cleanText(body.source),
    details: isObject(body.details) ? body.details : undefined,
  };

  try {
    await saveLog(log);
    return json({ success: true, message: "Log saved." }, 201);
  } catch {
    return json({ success: false, message: "Could not save log." }, 500);
  }
}

export async function GET(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? 25);
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 25;

  try {
    const logs = await readLogs(safeLimit);
    return json({ success: true, data: logs });
  } catch {
    return json({ success: false, message: "Could not read logs." }, 500);
  }
}
