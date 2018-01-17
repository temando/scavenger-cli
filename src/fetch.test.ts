import { ensureDir, pathExists } from 'fs-extra';
import { join } from 'path';
import { tmpNameSync } from 'tmp-promise';
import { fetch } from './index';
import { nullLogger } from './nullLogger';

describe('@temando/scavenger-cli/fetch', () => {
  const project = require('./.fixture/services.json').find((p) => p.id = 'remark-graphviz');
  const credentials = {
    username: 'username',
    token: 'password',
  };

  it('can fetch a project and save it to the specified path', async () => {
    const outputPath = tmpNameSync();
    const mockGit = () => {
      const api = {
        silent: () => api,
        clone: async (uri, id) => {
          const clonePath = join(outputPath, id);
          await ensureDir(clonePath);
          expect(uri).toEqual(
            'https://username:password@github.com/temando/remark-graphviz.git',
          );
          expect(id).toEqual(project.id);

          return api;
        },
        checkout: async (commitIsh) => {
          expect(commitIsh).toEqual(project.commitIsh);
        },
      };

      return api;
    };

    const out = await fetch(project, outputPath, credentials, nullLogger, mockGit);
    expect(out).toEqual(join(outputPath, project.id));

    const dirExists = await pathExists(join(outputPath, project.id));
    expect(dirExists).toBeTruthy();
  });

  it('throws an error if the clone path already exists', async () => {
    const outputPath = tmpNameSync();
    const mockGit = () => {
      const api = {
        silent: () => api,
        clone: async (uri, id) => {
          const clonePath = join(outputPath, id);
          await ensureDir(clonePath);
          return api;
        },
        checkout: async (commitIsh) => api,
      };

      return api;
    };

    const projectId = 'foobar';
    const exampleProject = {
      id: projectId,
      repositoryUrl: 'https://foo.com/foobar.git',
      name: projectId,
    };

    return expect(
      fetch(exampleProject, outputPath, credentials, nullLogger, mockGit),
    ).rejects;
  });
});
