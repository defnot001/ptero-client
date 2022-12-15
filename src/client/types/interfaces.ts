export interface AuthDetails {
  hostURL: string;
  apiKey: string;
}

export interface RequestURLOptions {
  hostURL: string;
  endpoint: string;
  serverID?: string;
  backupID?: string;
  directory?: string;
}

export interface Headers {
  headers: {
    Authorization: string;
    'Content-Type': string;
    Accept: string;
  };
}

interface BackupListAttributes {
  uuid: string;
  name: string;
  ignored_files: string[];
  sha256_hash: string;
  bytes: number;
  created_at: string;
  completed_at: string;
}

interface BackupMeta {
  backup_count: number;
  pagination: {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    links: Record<string, unknown>;
  };
}

interface PterodactylBackup {
  object: 'backup';
  attributes: BackupListAttributes;
}

export interface BackupListResponse {
  object: 'list';
  data: PterodactylBackup[];
  meta: BackupMeta;
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
