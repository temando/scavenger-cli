
import * as simpleGit from 'simple-git/promise';

// Remove once https://github.com/steveukx/git-js/pull/233
declare module 'simple-git/promise' {
  // tslint:disable-next-line interface-name
  interface SimpleGit {
    /**
     * Disables/enables the use of the console for printing warnings and errors, by default messages are not shown in
     * a production environment.
     *
     * @param {boolean} silence
     * @returns {Git}
     */
    // tslint:disable-next-line no-unnecessary-qualifier
    silent (silence ?: boolean): simpleGit.SimpleGit;
  }
}

export interface IConfiguration {
  docs: string[];
  src?: string[];
}

export interface IGitCredentials {
  username: string;
  token: string;
}

export interface IProject {
  id: string;
  name: string;
  repositoryUrl: string;
  commitIsh?: string;
}
