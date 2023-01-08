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

export type PteroServerState = 'starting' | 'running' | 'stopping' | 'offline';

export type PteroStats = {
  memory_bytes: number;
  memory_limit_bytes: number;
  cpu_absolute: number;
  network: {
    rx_bytes: number;
    tx_bytes: number;
  };
  state: PteroServerState;
  disk_bytes: number;
};

export type PteroWebsocketListeners = Readonly<{
  onOpen?: () => void;
  onAuthSuccess?: () => void;
  onStatus?: (status: PteroServerState) => void;
  onConsoleOutput?: (output: string) => void;
  onStats?: (stats: PteroStats) => void;
  onTokenExpiring?: () => void;
  onTokenExpired?: () => void;
  onClose?: (code: number, reason: Buffer) => void;
  onError?: (error: Error) => void;
}>;

export type WebsocketResponse = {
  event: TPteroEvent;
  args?: string[];
};

export type TPteroEvent =
  | 'auth success'
  | 'status'
  | 'console output'
  | 'stats'
  | 'token expiring'
  | 'token expired';
