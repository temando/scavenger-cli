import { getEndpoint } from './getEndpoint';
import { nullLogger } from './nullLogger';

describe('@temando/scavenger-cli/getEndpoint', () => {
  it('can be initialised', () => {
    expect(typeof getEndpoint).toEqual('function');
  });

  it('can format a git uri', () => {
    const repo = 'git@github.com:foo/bar.git';
    const credentials = {
      username: 'joe.bloe',
      token: 'abcdef',
    };

    expect(getEndpoint(repo, credentials, nullLogger)).toEqual(repo);
  });

  it('can format a https uri', () => {
    const repo = 'https://github.com:foo/bar.git';
    const credentials = {
      username: 'joe.bloe',
      token: 'abcdef',
    };
    const expected = `https://joe.bloe:abcdef@github.com:foo/bar.git`;

    expect(getEndpoint(repo, credentials, nullLogger)).toEqual(expected);
  });
});
