import { join } from 'path';
import { tmpNameSync } from 'tmp-promise';
import { thieve } from './index';
import { nullLogger } from './nullLogger';

describe('@temando/scavenger-cli/thieve', () => {
  it('can be initialised', () => {
    expect(typeof thieve).toEqual('function');
  });

  it('can scavenger some documents from a project', async () => {
    const testProjectPath = join(__dirname, '.fixture/test-project');
    const projectName = testProjectPath.split('/').pop();
    const testOutputPath = join(tmpNameSync(), projectName);
    const items = await thieve(testProjectPath, testOutputPath, nullLogger);

    const fixture = [
      'CONTRIBUTING.md',
      'README.md',
      'resources/example.json',
    ].map((basename) => join(testOutputPath, basename));

    expect(items).toEqual(fixture);
  });

  it('can scavenger documents using a .scavengerrc file', async () => {
    const testProjectPath = join(__dirname, '.fixture/test-project-scavengerrc');
    const projectName = testProjectPath.split('/').pop();
    const testOutputPath = join(tmpNameSync(), projectName);
    const items = await thieve(testProjectPath, testOutputPath, nullLogger);

    const fixture = [
      'test-sub-directory/test-file.md',
      'README.md',
      'CONTRIBUTING.md',
    ].map((basename) => join(testOutputPath, basename));

    expect(items).toEqual(fixture);
  });
});
