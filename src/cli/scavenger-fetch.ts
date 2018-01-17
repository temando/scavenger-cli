#!/usr/bin/env node

import * as Bluebird from 'bluebird';
import * as program from 'commander';
import { readFile } from 'fs-extra';
import * as stdin from 'get-stdin';
import * as isArrayOf from 'is-array-of';
import { ajvFactory, fetch, iProjectFactory, schema } from './../index';
import { IProject } from './../types';
import { options } from './constants';
import { getDirsFromArgs, getJsonFromSource, getLoggerFromArgs, writeJsonStdout } from './utils';

program
  .option(options.input.flag, options.input.description, `${process.cwd()}/services.json`)
  .option(options.output.flag, options.output.description, `${process.cwd()}/projects`)
  .option(options.concurrency.flag, options.concurrency.description, Infinity)
  .option(options.stdin.flag, options.stdin.description, false)
  .option(options.filter.flag, options.filter.description)
  .option(options.username.flag, options.username.description)
  .option(options.token.flag, options.token.description)
  .option(options.json.flag, options.json.description)
  .option(options.silent.flag, options.silent.description)
  .option(options.debug.flag, options.debug.description)
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

// tslint:disable no-floating-promises
(async () => {
  const ajv = ajvFactory();
  const logger = getLoggerFromArgs(program);
  const { src, dest } = getDirsFromArgs(program);
  const credentials = {
    username: program.username || process.env.SCAVENGER_USERNAME,
    token: program.token || process.env.SCAVENGER_TOKEN,
  };

  try {
    const input = await getJsonFromSource(program.stdin ? stdin() : readFile(src));
    // If an array of strings, assume git uri's, otherwise assume IProject[].
    const def: IProject[] = isArrayOf('string')(input) ? input.map(iProjectFactory) : input;

    if (!ajv.validate(schema.definition.$id, def)) {
      throw new Error(`invalid input:\n ${JSON.stringify(ajv.errors, null, 2)}`);
    }

    // Filter the resulting projects, if requested.
    const filteredProjects = program.filter
      ? def.filter((p) => p.id.match(program.filter))
      : def;

    // Actually fetch the projects
    const projects = await Bluebird.map(
      filteredProjects,
      (project) => fetch(project, dest, credentials, logger),
      { concurrency: program.concurrency },
    );

    if (program.json) {
      writeJsonStdout(projects);
    }
  } catch (err) {
    logger.error(err.stack);
    process.exitCode = 1;
  }
})();
