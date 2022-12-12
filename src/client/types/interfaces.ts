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

export interface BackupCreateResponse {
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

export interface AccountDetailsResponse {
  object: 'user';
  attributes: AccountDetailsAttributes;
}

export interface BackupOptions {
  backupName?: string;
  locked?: boolean;
}

interface ServerAttributeLimits {
  memory: number;
  swap: number;
  disk: number;
  io: number;
  cpu: number;
  threads: number;
  oom_disabled: boolean;
}

interface ServerAttributeFeatureLimits {
  databases: number;
  allocations: number;
  backups: number;
}

interface ServerAttributeRelationshipsAllocations {
  object: 'allocation';
  attributes: {
    id: number;
    ip: string;
    ip_alias: string;
    port: number;
    notes: string;
    is_default: boolean;
  };
}

interface ServerAttributeRelationships {
  allocations: {
    object: 'list';
    data: ServerAttributeRelationshipsAllocations[];
  };
  variables: {
    object: Record<string, unknown>;
  };
}

interface ServerAttributes {
  server_owner: boolean;
  identifier: string;
  internal_id: number;
  uuid: string;
  name: string;
  node: string;
  sftp_details: { ip: string; port: number };
  description: string;
  limits: ServerAttributeLimits;
  invocation: string;
  docker_image: string;
  egg_features: string[];
  feature_limits: ServerAttributeFeatureLimits;
  status: number;
  is_suspended: boolean;
  is_installing: boolean;
  is_transferring: boolean;
  relationships: ServerAttributeRelationships;
}

interface PterodactylServer {
  object: 'server';
  attributes: ServerAttributes;
}

export interface ListServersResponse {
  object: 'list';
  data: PterodactylServer[];
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
      links: Record<string, unknown>;
    };
  };
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
