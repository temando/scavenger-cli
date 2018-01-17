import { IGitCredentials } from './types';

// Formats an authenticated git uri given some credentials and a base uri.
export const getEndpoint = (uri: string, credentials: IGitCredentials, logger) => {
  const { username, token } = credentials;

  // If username/token is provided, and https uri's have been given, attempt to
  // sub in the credentials into the uri.
  if (username || token) {
    logger.debug(`Adding credentials for ${username}.`);

    if (uri.startsWith('https://')) {
      return `https://${username}:${token}@`.concat(uri.split('https://').pop());
    }
  }

  return uri;
};
