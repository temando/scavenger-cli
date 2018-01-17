import { iProjectFactory } from './iProjectFactory';

describe('@temando/scavenger-cli/iProjectFactory', () => {
  it('can be initialised', () => {
    expect(typeof iProjectFactory).toEqual('function');
  });

  it('returns a project from uri', () => {
    const uri = 'git@github.com:foo/bar.git';
    const project = {
      id: 'bar',
      name: 'bar',
      repositoryUrl: uri,
      commitIsh: 'master',
    };

    expect(iProjectFactory(uri)).toEqual(project);
  });
});
