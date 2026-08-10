// src/lib/logger.ts

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogPayload {
  message: string;
  context?: string;
  durationMs?: number;
  path?: string;
  type?: "query" | "mutation" | "subscription";
  userId?: string;
  error?: unknown;
  [key: string]: unknown;
}

export const logger = {
  info: (payload: LogPayload) => log("info", payload),
  warn: (payload: LogPayload) => log("warn", payload),
  error: (payload: LogPayload) => log("error", payload),
  debug: (payload: LogPayload) => log("debug", payload),
};

function log(level: LogLevel, payload: LogPayload) {
  const timestamp = new Date().toISOString();
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    // Format terminal dev yang rapi dan berwarna
    const colorMap = {
      info: "\x1b[32m[INFO]\x1b[0m", // Hijau
      warn: "\x1b[33m[WARN]\x1b[0m", // Kuning
      error: "\x1b[31m[ERROR]\x1b[0m", // Merah
      debug: "\x1b[34m[DEBUG]\x1b[0m", // Biru
    };

    const duration =
      payload.durationMs !== undefined
        ? ` \x1b[35m(${payload.durationMs}ms)\x1b[0m`
        : "";
    const path = payload.path ? ` \x1b[36m[${payload.path}]\x1b[0m` : "";

    console.log(
      `${colorMap[level]} ${timestamp}${path}: ${payload.message}${duration}`,
    );
    if (payload.error) {
      console.error("\x1b[31mDetails:\x1b[0m", payload.error);
    }
  } else {
    // Format JSON terstruktur untuk Production Logging Aggregators
    console.log(
      JSON.stringify({
        timestamp,
        level,
        ...payload,
        error:
          payload.error instanceof Error
            ? payload.error.message
            : payload.error,
      }),
    );
  }
}
