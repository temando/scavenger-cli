import { ensureDir, pathExists, remove } from 'fs-extra';
import { join } from 'path';
import * as simpleGit from 'simple-git/promise';
import { ajvFactory, getEndpoint, schema } from './index';
import { IGitCredentials, IProject } from './types';

export async function fetch (
  project: IProject,
  outputPath: string,
  credentials: IGitCredentials,
  logger,
  git = simpleGit,
): Promise<string> {
  const ajv = ajvFactory();
  if (!ajv.validate(schema.gitRepository.$id, project)) {
    throw new Error(JSON.stringify(ajv.errors, null, 2));
  }

  await ensureDir(outputPath);

  const projectClonePath = join(outputPath, project.id);
  if (await pathExists(projectClonePath)) {
    logger.debug(`Removing existing project at ${projectClonePath}.`);
    await remove(projectClonePath);
  }

  // Clone the project using git.
  try {
    const endpoint = getEndpoint(project.repositoryUrl, credentials, logger);
    logger.debug(`Fetching ${project.id} to ${projectClonePath}`);
    await git(outputPath).silent(true).clone(endpoint, project.id);
  } catch (err) {
    throw new Error(`Fetch ${project.id} has failed: ${err.message}`);
  }

  // Check out project at certain ref.
  if (project.commitIsh) {
    logger.debug(`Checking out ${project.id} ref ${project.commitIsh}`);

    try {
      await git(projectClonePath).silent(true).checkout(project.commitIsh);
      logger.info(`${project.id} has been fetched at ref ${project.commitIsh}`);
    } catch (err) {
      throw new Error(`Failed to checkout ${project.id} at ref ${project.commitIsh}`);
    }
  } else {
    logger.info(`${project.id} has been fetched`);
  }

  return projectClonePath;
}
