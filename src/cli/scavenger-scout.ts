#!/usr/bin/env node

import * as program from 'commander';
import { IProject } from './../types';
import { options } from './constants';
import { getLoggerFromArgs, writeJsonStdout } from './utils';

program
  .option(options.json.flag, options.json.description)
  .option(options.silent.flag, options.silent.description)
  .option(options.debug.flag, options.debug.description)
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

// tslint:disable no-floating-promises
(async () => {
  const logger = getLoggerFromArgs(program);
  const [name, ...args] = program.args;

  try {
    const scout = require(`scavenger-scent-${name}`);
    const resources: IProject[] = await scout(args, logger);

    if (program.json) {
      writeJsonStdout(resources);
    }
  } catch (err) {
    logger.error(err.stack);
    process.exitCode = 1;
  }
})();
