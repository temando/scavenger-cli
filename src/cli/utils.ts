import { nullLogger } from '../nullLogger';

/**
 * If the args contain json, or silent mode, a noop logger is returned.
 *
 * Otherwise, an instance of winston is returned.
 */
export function getLoggerFromArgs (program) {
  const noLogs = (program.json || program.silent);
  if (noLogs) {
    return nullLogger;
  }

  const logger = require('winston');
  logger.cli();

  if (program.debug) {
    logger.level = 'debug';
  }

  return logger;
}

/**
 * Returns an object with `src` and `dest` keys that are derived from parsing
 * the command arguments.
 */
export function getDirsFromArgs (program): { src: string, dest: string } {
  // XXX: Woah there. This needs both safety and abstraction added into the mix.
  const src = program.input
    ? program.input
    : program.output
      ? program.args[0]
      : program.args[1];
  const dest = program.output
    ? program.output
    : program.input || program.stdin
      ? program.args[0]
      : program.args[1];

  return { src, dest };
}

/**
 * Given a callable function, parse it as json input or fail.
 *
 * @throws Error when `source` does not return JSON.
 */
export async function getJsonFromSource (fn): Promise<any> {
  const buf: Buffer = await fn;
  const str = buf.toString();
  let input;

  try {
    input = JSON.parse(str);
  } catch (err) {
    throw new Error(`input not valid json:\n${str}`);
  }

  return input;
}

/**
 * Writes data out to stdout as formatted JSON.
 */
export function writeJsonStdout (data: any): void {
  process.stdout.write(JSON.stringify(data, null, 2));
  process.stdout.write('\n');
}

/**
 * Parses a comma-delimited string into an array of trimmed strings.
 */
export function parseList (str: string): string[] {
  return str.split(',').map((g) => g.trim());
}
