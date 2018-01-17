export const scavengerRc = {
  $id: 'https://schema.temando.io/scavenger/scavenger-rc+v1#',
  type: 'object',
  description: 'The .scavengerrc json format.',
  properties: {
    docs: {
      description: 'A list of glob patterns to match documentation with.',
      type: 'array',
      items: {
        $ref: '#/definitions/glob',
      },
    },
  },
  definitions: {
    glob: {
      description: 'A glob pattern that points to some resources in the project.',
      type: 'string',
      minLength: 1,
    },
  },
};
