const noop = () => void 0;

export const nullLogger = {
  log: noop,
  info: noop,
  debug: noop,
  error: noop,
  warn: noop,
  profile: noop,
};
