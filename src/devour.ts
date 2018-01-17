import * as Bluebird from 'bluebird';
import { join } from 'path';
import { getPossibleDocs } from './getPossibleDocs';
import { fetch as ft, thieve as th } from './index';
import { IGitCredentials, IProject } from './types';

export async function devour (
  projects: IProject[],
  projectsOutputPath: string,
  outputPath: string,
  credentials: IGitCredentials,
  logger,
  filter: string[],
  fetch = ft,
  thieve = th,
): Promise<any> {
  let count = 0;

  return Bluebird.map(projects, async (project) => {
    try {
      const projectClonePath = await fetch(project, projectsOutputPath, credentials, logger);

      // Ensure the glob that comes in is an absolute path.
      const projectFilter = (filter)
        ? filter.map((el) => join(projectClonePath, el))
        : await getPossibleDocs(projectClonePath);

      const resources = await thieve(
        projectClonePath,
        join(outputPath, project.id),
        logger,
        projectFilter,
      );

      count++;
      logger.info(`${project.id} has been hunted and thieved.`);
      logger.info(`>> ${count}/${projects.length} completed`);

      return resources;
    } catch (err) {
      logger.warn(err.message, err.stack);
    }
  });
}
