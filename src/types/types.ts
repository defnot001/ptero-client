export type AuthDetails = {
  baseURL: string;
  apiKey: string;
};

export type Headers = {
  headers: {
    Authorization: string;
    'Content-Type': string;
    Accept: string;
  };
};
export type RequestURLOptions = {
  endpoint: string;
  serverID?: string;
  backupID?: string;
  directory?: string;
};

export type APIError = {
  code: string;
  status: string;
  detail: string;
};

export type BackupOptions = {
  backupName?: string;
  locked?: boolean;
};

export type RenameOptions = {
  from: string;
  to: string;
  directory?: string;
};
