type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

const formatLog = (entry: LogEntry): string => {
  const meta = entry.metadata ? ` ${JSON.stringify(entry.metadata)}` : '';
  return `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}${meta}`;
};

const createLogEntry = (
  level: LogLevel,
  message: string,
  metadata?: Record<string, unknown>,
): LogEntry => ({
  level,
  message,
  metadata,
  timestamp: new Date().toISOString(),
});

export const logger = {
  info: (message: string, metadata?: Record<string, unknown>): void => {
    const entry = createLogEntry('info', message, metadata);
    // eslint-disable-next-line no-console
    console.info(formatLog(entry));
  },

  warn: (message: string, metadata?: Record<string, unknown>): void => {
    const entry = createLogEntry('warn', message, metadata);
    console.warn(formatLog(entry));
  },

  error: (message: string, metadata?: Record<string, unknown>): void => {
    const entry = createLogEntry('error', message, metadata);
    console.error(formatLog(entry));
  },

  debug: (message: string, metadata?: Record<string, unknown>): void => {
    const entry = createLogEntry('debug', message, metadata);
    // eslint-disable-next-line no-console
    console.debug(formatLog(entry));
  },
};
