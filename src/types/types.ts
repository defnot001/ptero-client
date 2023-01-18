import type { CloseEvent, ErrorEvent } from 'ws';

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

export type PteroWebsocketListeners = {
  open: () => void;
  'auth success': () => void;
  status: (status: PteroServerState) => void;
  'console output': (output: string) => void;
  stats: (stats: PteroStats) => void;
  'token expiring': () => void;
  'token expired': () => void;
  close?: (code: CloseEvent) => void;
  error?: (error: ErrorEvent) => void;
};

export type WebsocketResponse = {
  event: PteroEvent;
  args?: string[];
};

export type PteroEvent =
  | 'auth success'
  | 'status'
  | 'console output'
  | 'stats'
  | 'token expiring'
  | 'token expired';

export type PowerAction = 'start' | 'stop' | 'restart' | 'kill';

export type SendObjectOptions = {
  objectType: 'command' | 'state' | 'logs' | 'stats';
  command?: string;
  action?: PowerAction;
};
