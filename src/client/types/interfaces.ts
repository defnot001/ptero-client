export interface AuthDetails {
  baseURL: string;
  apiKey: string;
}

export interface Headers {
  headers: {
    Authorization: string;
    'Content-Type': string;
    Accept: string;
  };
}
export interface RequestURLOptions {
  endpoint: string;
  serverID?: string;
  backupID?: string;
  directory?: string;
}

export interface APIError {
  code: string;
  status: string;
  detail: string;
}

export interface BackupOptions {
  backupName?: string;
  locked?: boolean;
}

export interface RenameOptions {
  from: string;
  to: string;
  directory?: string;
}
