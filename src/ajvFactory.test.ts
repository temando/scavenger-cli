import * as Ajv from 'ajv';
import { ajvFactory, schema } from './index';

describe('@scavenger-cli/ajvFactory', () => {
  it('can be initialised', () => {
    expect(typeof ajvFactory).toEqual('function');
    expect(ajvFactory()).toBeInstanceOf(Ajv);
  });

  it('pre-loads all of the scavenger schemas', () => {
    const ajv = ajvFactory();

    Object.keys(schema).forEach((key) => {
      expect(ajv.getSchema(schema[key].$id)).toHaveProperty('schema');
    });
  });
});
