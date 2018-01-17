export const gitRepository = {
  $id: 'https://schema.temando.io/scavenger/git-repository+v1#',
  description: 'A generic schema to represent a git repository.',
  type: 'object',
  required: ['id', 'name', 'repositoryUrl'],
  properties: {
    id: {
      type: 'string',
      minLength: 1,
      // XXX: should have regex validation to make sure input is path friendly.
    },
    name: {
      type: 'string',
      minLength: 1,
    },
    repositoryUrl: {
      type: 'string',
      format: 'uri',
    },
    commitIsh: {
      type: 'string',
      default: 'master',
    },
  },
};
