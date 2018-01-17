import { processConfig } from './getPossibleDocs';

describe('@temando/scavenger-cli/processConfig', () => {
  it('can return a configuration from a scavengerrc object', () => {
    const config = {
      docs: ['README.md'],
      src: ['CHANGELOG.md', 'ARCH.md'],
    };
    expect(processConfig(config, '/foo'))
      .toEqual(['/foo/README.md', '/foo/CHANGELOG.md', '/foo/ARCH.md']);
  });

  it('guards against slashes in path input', () => {
    const config = {
      docs: ['README.md', '/CHANGELOG.md'],
      src: ['/ARCH.md'],
    };
    expect(processConfig(config, '/foo/'))
      .toEqual(['/foo/README.md', '/foo/CHANGELOG.md', '/foo/ARCH.md']);
  });
});
