/**
 * Specifies common CLI option definitions, to ensure consistency between
 * CLI commands.
 */
export const options = {
  input: {
    flag: '-i, --input <path>',
    description: 'Specify input data path.',
  },
  output: {
    flag: '-o, --output <path>',
    description: 'Specify an output directory.',
  },
  stdin: {
    flag: '--stdin',
    description: 'Read input from STDIN.',
  },
  silent: {
    flag: '--silent',
    description: 'Disable logging to the console.',
  },
  json: {
    flag: '--json',
    description: 'Toggle json output.',
  },
  filter: {
    flag: '-f, --filter <value>',
    description: 'Filter input via paths that match this regular expression.',
  },
  glob: {
    flag: '-g, --glob <items>',
    description: 'A comma-separated list of glob patterns to match for.',
  },
  username: {
    flag: '-u, --username <value>',
    description: 'A username to authenticate with a remote git server.',
  },
  token: {
    flag: '-t, --token <value>',
    description: 'An authentication token for use with a remote git server.',
  },
  clonePath: {
    flag: '-c, --clonePath <path>',
    description: 'Specifiy a directory to clone into, defaults to OS tmp folder.',
  },
  concurrency: {
    flag: '--concurrency <value>',
    description: 'Concurency can affect the speed in which operations are performed.',
  },
  debug: {
    flag: '--debug',
    description: 'Enable debug level logging to the console.',
  },
};
