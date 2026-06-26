import { configure, getConsoleSink, getLogger, type LogLevel } from "@logtape/logtape";

let configured = false;

/**
 * Configure LogTape once for the whole process. Safe to call multiple times —
 * subsequent calls are no-ops. Call this at app boot (server entry, scripts).
 */
export async function setupLogging(level: LogLevel = "info"): Promise<void> {
  if (configured) return;
  configured = true;

  await configure({
    reset: true,
    sinks: {
      console: getConsoleSink(),
    },
    loggers: [
      { category: [], sinks: ["console"], lowestLevel: level },
      { category: ["logtape", "meta"], sinks: ["console"], lowestLevel: "warning" },
    ],
  });
}

export type { LogLevel };
/**
 * Get a logger scoped to a category, e.g. `getLogger(["server", "auth"])`.
 * Re-exported from LogTape so callers depend only on this package.
 */
export { getLogger };
