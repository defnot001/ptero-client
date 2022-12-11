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

interface Backup {
  object: 'backup';
  attributes: BackupListAttributes;
}

export interface BackupListResponseData {
  object: 'list';
  data: Backup[];
  meta: BackupMeta;
}

interface BackupCreateAttributes {
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

export interface BackupCreateResponseData {
  object: 'backup';
  attributes: BackupCreateAttributes;
}

export interface APIError {
  code: string;
  status: string;
  detail: string;
}

interface AccountDetailsAttributes {
  id: number;
  admin: boolean;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  language: string;
}

export interface AccountDetailsResponseData {
  object: 'user';
  attributes: AccountDetailsAttributes;
}

export interface BackupOptions {
  backupName?: string;
  locked?: boolean;
}
