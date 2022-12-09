export interface AuthDetails {
  hostURL: string;
  apiKey: string;
}

export interface RequestURLOptions {
  hostURL: string;
  endpoint: string;
  serverID?: string;
  backupID?: string;
}

export interface PteroHeaders {
  headers: {
    Authorization: string;
    'Content-Type': string;
    Accept: string;
  };
}

interface PteroBackupListAttributes {
  uuid: string;
  name: string;
  ignored_files: string[];
  sha256_hash: string;
  bytes: number;
  created_at: string;
  completed_at: string;
}

interface PteroBackupMeta {
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

interface PteroBackup {
  object: 'backup';
  attributes: PteroBackupListAttributes;
}

export interface PteroBackupListResponseData {
  object: 'list';
  data: PteroBackup[];
  meta: PteroBackupMeta;
}

interface PteroBackupCreateAttributes {
  uuid: string;
  is_successful: boolean;
  is_locked: boolean;
  name: string;
  ignored_files: string[];
  checksum: null;
  bytes: number;
  created_at: string;
  completed_at: string;
}

export interface PteroBackupCreateResponseData {
  object: 'backup';
  attributes: PteroBackupCreateAttributes;
}

export interface PteroAPIError {
  code: string;
  status: string;
  detail: string;
}
