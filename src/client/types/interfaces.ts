export interface AuthDetails {
  hostURL: string;
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
  hostURL: string;
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

/*
 */
