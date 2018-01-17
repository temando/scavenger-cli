import { pathExists, readJsonSync } from 'fs-extra';
import { join } from 'path';
import { IConfiguration } from './types/index';

export const defaultDocsGlob: string[] = [
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'README.md',
  'resources',
  'ts-definition.+(json|yaml|yml)',
];

/**
 * Returns a list of globs, that represent possible documentation sources as
 * specified by default hueristics, or by a project or process level
 * .scavengerrc.json file.
 */
export async function getPossibleDocs (projectPath: string): Promise<string[]> {
  let defaultDocs = defaultDocsGlob.map((el) => join(projectPath, el));

  // project level config file.
  if (await pathExists(`${projectPath}/.scavengerrc.json`)) {
    const config = readJsonSync(`${projectPath}/.scavengerrc.json`);
    defaultDocs = processConfig(config, projectPath);

  // process level config file.
  } else if (await pathExists(`${process.cwd()}/.scavengerrc.json`)) {
    const config = readJsonSync(`${process.cwd()}/.scavengerrc.json`);
    defaultDocs = processConfig(config, projectPath);
  }

  return defaultDocs;
}

/**
 * A factory to create a configuration from the .scavengerrc format.
 */
export function processConfig (config: IConfiguration, path: string): string[] {
  // XXX: The config should be validated with a JSON schema.
  const docs = [];

  if (config.docs) {
    config.docs.map((el) => join(path, el)).map((el) => docs.push(el));
  }

  if (config.src) {
    config.src.map((el) => join(path, el)).map((el) => docs.push(el));
  }

  return docs;
}
