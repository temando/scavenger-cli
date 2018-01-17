import * as Ajv from 'ajv';
import { schema as defaultSchema } from './index';

export const ajvFactory = (schema = defaultSchema) => {
  const ajv = new Ajv();

  Object.keys(schema).map((key) => ajv.addSchema(schema[key]));

  return ajv;
};
