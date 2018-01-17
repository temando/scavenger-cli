import { gitRepository } from './git-repository+v1';

export const definition = {
  $id: 'https://schema.temando.io/scavenger/definition+v1#',
  description: 'A format for defining multiple projects for scavenger to operate on.',
  type: 'array',
  items: {
    $ref: gitRepository.$id,
  },
};
