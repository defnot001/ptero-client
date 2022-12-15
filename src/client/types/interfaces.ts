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

interface AccountDetailsAttributes {
  id: number;
  admin: boolean;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  language: string;
}

export interface AccountDetailsResponse {
  object: 'user';
  attributes: AccountDetailsAttributes;
}

export interface BackupOptions {
  backupName?: string;
  locked?: boolean;
}

interface PterodactylFile {
  object: 'file_object';
  attributes: {
    name: string;
    mode: string;
    mode_bits: string;
    size: number;
    is_file: boolean;
    is_symlink: boolean;
    mimetype: string;
    created_at: string;
    modified_at: string;
  };
}
export interface ListFilesResponse {
  object: 'list';
  data: PterodactylFile[];
}
/*
 */
