import type { PteroHeaders, RequestURLOptions } from '../types/interfaces';

export const getRequestHeaders = (apiKey: string): PteroHeaders => {
  return {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };
};

export const getRequestURL = (requestOptions: RequestURLOptions): string => {
  let { hostURL, endpoint } = requestOptions;
  const { serverID, backupID } = requestOptions;

  if (!hostURL.endsWith('/')) hostURL += '/';

  if (serverID) endpoint = endpoint.replace(':server_id', serverID);
  if (backupID) endpoint = endpoint.replace(':backup_id', backupID);

  return hostURL + endpoint;
};
