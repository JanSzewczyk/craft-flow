const noop = () => {};

const childLogger = {
  info: noop,
  warn: noop,
  error: noop,
  debug: noop,
  trace: noop,
  fatal: noop,
  child: () => childLogger
};

const logger = {
  ...childLogger,
  child: () => childLogger
};

export function createLogger(_context: Record<string, unknown>) {
  return childLogger;
}

export default logger;
