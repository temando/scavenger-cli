#!/usr/bin/env node

import * as program from 'commander';

program
  .version('1.0.0')
  .command('scout <name>', 'Execute an external scavenger scout, arguments are forwarded to it')
  .command('fetch', 'Fetch the project from scouted definitions stored in the definitions file.')
  .command('thieve',
  `Prepare documentation from the specified project for html generation.
   Project must have been previously fetched.`)
  .command('devour', 'Fetch and thieve all projects stored in the specified definitions file.')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
