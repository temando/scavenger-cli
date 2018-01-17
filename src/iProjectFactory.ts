import { IProject } from './types';

// Creates an IProject object from a git uri.
export function iProjectFactory (uri: string): IProject {
  // Extract a project name from the git uri, otherwise just use the uri.
  const matches = uri.match(/\/(.*).git$/);
  const name = (matches) ? matches[1] : uri;

  return {
    id: name,
    name,
    repositoryUrl: uri,
    commitIsh: 'master',
  };
}
