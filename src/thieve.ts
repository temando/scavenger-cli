import * as Bluebird from 'bluebird';
import { copy, ensureDir, pathExists } from 'fs-extra';
import * as glob from 'globby';
import { getPossibleDocs } from './getPossibleDocs';

export const defaultConfig = {
  glob: {
    mark: true,
  },
  copy: {
    overwrite: true,
    dereference: true,
    preserveTimestamps: true,
  },
};

// Greps a directory for some items of interest and copies them to
// another directory.
export async function thieve (
  fromDir: string,
  toDir: string,
  logger,
  filter?: string[],
  options = defaultConfig,
): Promise<string[]> {
  const fromDirExists = await pathExists(fromDir);
  if (!fromDirExists) {
    throw new Error(`Source path does not exist: ${fromDir}`);
  }

  await ensureDir(toDir);

  // If no filter present, use the default.
  if (!filter) {
    filter = await getPossibleDocs(fromDir);
  }

  logger.debug(`scavenging directory ${fromDir}`);

  const files = await glob(filter, options.glob);
  const items = await Bluebird.map(files, async (filepath) => {
    // Create destination, respecting nested folders
    const dest = `${toDir}/${filepath.replace(`${fromDir}/`, '')}`;

    await copy(filepath, dest, options.copy);
    logger.debug(`copied file to ${dest}`);

    return dest;
  });

  if (Array.isArray(items)) {
    logger.info(`Scavenged ${items.length} sources from ${fromDir}`);
  } else {
    throw new Error(`Expected an array but got [type::value] ${typeof items}::${items}`);
  }

  return items;
}
