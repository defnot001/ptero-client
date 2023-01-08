export const ClientEndpoints = {
  getAccountDetails: '/api/client/account',
  listServers: '/api/client',
  listFiles: '/api/client/servers/:server_id/files/list?directory=',
  getFileContents: '/api/client/servers/:server_id/files/contents?file=',
  downloadFile: '/api/client/servers/:server_id/files/download?file=',
  renameFile: '/api/client/servers/:server_id/files/rename',
  copyFile: '/api/client/servers/:server_id/files/copy',
  writeFile: '/api/client/servers/:server_id/files/write?file=',
  compressFile: '/api/client/servers/:server_id/files/compress',
  decompressFile: '/api/client/servers/:server_id/files/decompress',
  deleteFile: '/api/client/servers/:server_id/files/delete',
  createDirectory: '/api/client/servers/:server_id/files/create-folder',
  changePowerState: '/api/client/servers/:server_id/power',
  listBackups: '/api/client/servers/:server_id/backups',
  createBackup: '/api/client/servers/:server_id/backups',
  backupDetails: '/api/client/servers/:server_id/backups/:backup_id',
  downloadBackup: '/api/client/servers/:server_id/backups/:backup_id/download',
  deleteBackup: '/api/client/servers/:server_id/backups/:backup_id',
  resourceUsage: '/api/client/servers/:server_id/resources',
  consoleDetails: '/api/client/servers/:server_id/websocket',
} as const;

type TClientEndpoints = typeof ClientEndpoints[keyof typeof ClientEndpoints];

export const replaceVariables = (
  endpoint: TClientEndpoints,
  options: { serverID?: string; backupID?: string },
) => {
  let newEndpoint: string = endpoint;
  const { serverID, backupID } = options;

  if (serverID) newEndpoint = newEndpoint.replace(':server_id', serverID);
  if (backupID) newEndpoint = newEndpoint.replace(':backup_id', backupID);

  return newEndpoint;
};
