import { PteroClient } from './classes/client';

export default PteroClient;

export type { AuthDetails, BackupOptions, RenameOptions } from './types/types';
export type { AccountDetails } from './validation/AccountSchema';
export type {
  PterodactylBackup,
  PterodactylBackupListMeta,
} from './validation/BackupSchema';
export type { PterodactylFile } from './validation/FileSchema';
export type { PterodactylServer } from './validation/ServerSchema';
