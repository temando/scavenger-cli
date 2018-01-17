import { tmpNameSync } from 'tmp-promise';
import { devour } from './index';
import { nullLogger } from './nullLogger';

describe('@temando/scavenger-cli/devour', () => {
  it('can devour a catalog', async () => {
    const catalog = require('./.fixture/services.json');
    const projectsOutputPath = tmpNameSync();
    const outputPath = tmpNameSync();
    const credentials = {
      username: 'username',
      token: 'password',
    };
    const thieve = jest.fn((project) => `${projectsOutputPath}/${project.id}`);
    const fetch = jest.fn((fromDir, toDir) => `${toDir}/README.md`);

    const files = await devour(
      catalog, projectsOutputPath, outputPath, credentials, nullLogger, undefined, thieve, fetch,
    );

    expect(thieve).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalled();
    expect(files).toHaveLength(4);
  });
});
