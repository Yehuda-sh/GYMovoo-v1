// src/utils/logger.ts
/**
 * Lightweight, typed logger for React Native (mobile-only)
 * - Dev-friendly formatting (emoji, groupCollapsed when available)
 * - Production-safe: debug/info gated; warn/error always print
 * - Error normalization (Error -> { name, message, stack })
 * - Safe data serialization (handles circular refs)
 * - Configurable via EXPO_PUBLIC_LOG_LEVEL / NODE_ENV / __DEV__
 */

type LogLevel = "silent" | "error" | "warn" | "info" | "debug";

const IS_DEV =
  (typeof __DEV__ !== "undefined" && __DEV__) ||
  process.env.NODE_ENV === "development";

// Determine initial level:
// 1) EXPO_PUBLIC_LOG_LEVEL (expo), 2) LOG_LEVEL, else dev→debug / test→silent / prod→warn
const envLevel =
  (process.env.EXPO_PUBLIC_LOG_LEVEL as LogLevel | undefined) ||
  (process.env.LOG_LEVEL as LogLevel | undefined);

let currentLevel: LogLevel =
  envLevel ??
  (IS_DEV ? "debug" : process.env.NODE_ENV === "test" ? "silent" : "warn");

// --- helpers ---
const levelWeight: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

const shouldLog = (level: LogLevel) =>
  levelWeight[level] <= levelWeight[currentLevel];

const ts = () => {
  const d = new Date();
  const pad = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(
    d.getSeconds()
  )}.${pad(d.getMilliseconds(), 3)}`;
};

const normalizeError = (err: unknown) => {
  if (err instanceof Error) {
    return { name: err.name, message: err.message, stack: err.stack };
  }
  return err;
};

// JSON.stringify with circular-safe replacer
const safeStringify = (value: unknown) => {
  const seen = new WeakSet<object>();
  try {
    return JSON.stringify(
      value,
      (_key, val) => {
        if (typeof val === "object" && val !== null) {
          if (seen.has(val as object)) return "[Circular]";
          seen.add(val as object);
        }
        if (val instanceof Error) {
          return normalizeError(val);
        }
        return val;
      },
      2
    );
  } catch {
    try {
      return String(value);
    } catch {
      return "[Unserializable]";
    }
  }
};

const fmtCat = (category: string) => (category ? `[${category}]` : "");

// Typed console with optional group APIs (no `any`)
type ConsoleWithGroups = Console & {
  groupCollapsed?: (...args: unknown[]) => void;
  group?: (...args: unknown[]) => void;
  groupEnd?: (...args: unknown[]) => void;
};

const safeGroup = (
  header: string,
  printer: () => void,
  collapsed = true
): void => {
  const c = console as ConsoleWithGroups;
  const open =
    (collapsed ? c.groupCollapsed : c.group)?.bind(console) ?? undefined;
  const close = c.groupEnd?.bind(console) ?? undefined;

  if (open && close) {
    try {
      open(header);
      printer();
    } finally {
      close();
    }
  } else {
    (console.log as (...args: unknown[]) => void)(header);
    printer();
  }
};

// Select printers once (avoids `?.()` + `??` expressions)
const debugPrinter: (...args: unknown[]) => void =
  typeof console.debug === "function"
    ? console.debug.bind(console)
    : console.log.bind(console);

const infoPrinter: (...args: unknown[]) => void =
  typeof console.info === "function"
    ? console.info.bind(console)
    : console.log.bind(console);

const warnPrinter: (...args: unknown[]) => void = console.warn.bind(console);
const errorPrinter: (...args: unknown[]) => void = console.error.bind(console);

// --- public API ---
export const logger = {
  setLevel(level: LogLevel) {
    currentLevel = level;
  },
  getLevel(): LogLevel {
    return currentLevel;
  },

  debug(category: string, message: string, data?: unknown) {
    if (!shouldLog("debug")) return;
    const prefix = `🔍 ${ts()} ${fmtCat(category)} ${message}`;
    if (data !== undefined) {
      safeGroup(prefix, () => {
        debugPrinter(safeStringify(data));
      });
    } else {
      debugPrinter(prefix);
    }
  },

  info(category: string, message: string, data?: unknown) {
    if (!shouldLog("info")) return;
    const prefix = `ℹ️ ${ts()} ${fmtCat(category)} ${message}`;
    if (data !== undefined) {
      safeGroup(
        prefix,
        () => {
          infoPrinter(safeStringify(data));
        },
        false
      );
    } else {
      infoPrinter(prefix);
    }
  },

  warn(category: string, message: string, data?: unknown) {
    const prefix = `⚠️ ${ts()} ${fmtCat(category)} ${message}`;
    if (data !== undefined) {
      safeGroup(
        prefix,
        () => {
          warnPrinter(safeStringify(data));
        },
        false
      );
    } else {
      warnPrinter(prefix);
    }
  },

  error(category: string, message: string, error?: unknown) {
    const prefix = `❌ ${ts()} ${fmtCat(category)} ${message}`;
    if (error !== undefined) {
      safeGroup(
        prefix,
        () => {
          errorPrinter(safeStringify(normalizeError(error)));
        },
        false
      );
    } else {
      errorPrinter(prefix);
    }
  },
};

export type { LogLevel };
