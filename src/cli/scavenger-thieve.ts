#!/usr/bin/env node

import * as Bluebird from 'bluebird';
import * as program from 'commander';
import * as stdin from 'get-stdin';
import { join } from 'path';
import { thieve } from './../index';
import { options } from './constants';
import { getDirsFromArgs, getJsonFromSource, getLoggerFromArgs, parseList, writeJsonStdout } from './utils';

program
  .option(options.input.flag, options.input.description, `${process.cwd()}/projects`)
  .option(options.output.flag, options.output.description, `${process.cwd()}/docs`)
  .option(options.concurrency.flag, options.concurrency.description, Infinity)
  .option(options.stdin.flag, options.stdin.description, false)
  .option(options.glob.flag, options.glob.description, parseList)
  .option(options.filter.flag, options.filter.description)
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
  const { src, dest } = getDirsFromArgs(program);

  try {
    let resources;

    // No stdin? Great, just thieve the source into the destination.
    if (!program.stdin) {
      const projectName = program.args[0];
      resources = await thieve(join(src, projectName), join(dest, projectName), logger, program.glob);

      // Otherwise parse the stdin and thieve.
      // XXX: Assumes stdin to this command will always be an array of strings.
    } else {
      const sources: string[] = await getJsonFromSource(stdin());
      const filteredSources = program.filter
        ? sources.filter((p) => p.match(program.filter))
        : sources;

      resources = await Bluebird.map(
        filteredSources,
        async (source) => {
          const suffix = source.split('/').pop();

          return thieve(source, join(dest, suffix), logger, program.glob);
        },
        { concurrency: program.concurrency },
      );
    }

    if (program.json && !program.silent) {
      writeJsonStdout(resources);
    }
  } catch (err) {
    logger.error(err.stack);
    process.exitCode = 1;
  }
})();
