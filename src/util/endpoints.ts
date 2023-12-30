export const ClientEndpoints = {
  getAccountDetails: "/api/client/account",
  listServers: "/api/client",
  listFiles: "/api/client/servers/:server_id/files/list?directory=",
  getFileContents: "/api/client/servers/:server_id/files/contents?file=",
  downloadFile: "/api/client/servers/:server_id/files/download?file=",
  renameFile: "/api/client/servers/:server_id/files/rename",
  copyFile: "/api/client/servers/:server_id/files/copy",
  writeFile: "/api/client/servers/:server_id/files/write?file=",
  compressFile: "/api/client/servers/:server_id/files/compress",
  decompressFile: "/api/client/servers/:server_id/files/decompress",
  deleteFile: "/api/client/servers/:server_id/files/delete",
  createDirectory: "/api/client/servers/:server_id/files/create-folder",
  changePowerState: "/api/client/servers/:server_id/power",
  listBackups: "/api/client/servers/:server_id/backups",
  createBackup: "/api/client/servers/:server_id/backups",
  backupDetails: "/api/client/servers/:server_id/backups/:backup_id",
  downloadBackup: "/api/client/servers/:server_id/backups/:backup_id/download",
  deleteBackup: "/api/client/servers/:server_id/backups/:backup_id",
  resourceUsage: "/api/client/servers/:server_id/resources",
  consoleDetails: "/api/client/servers/:server_id/websocket",
  sendCommand: "/api/client/servers/:server_id/command",
} as const;

type TClientEndpoints = (typeof ClientEndpoints)[keyof typeof ClientEndpoints];

export const replaceVariables = (
  endpoint: TClientEndpoints,
  options: { serverID?: string; backupID?: string }
) => {
  let newEndpoint: string = endpoint;
  const { serverID, backupID } = options;

  if (serverID) newEndpoint = newEndpoint.replace(":server_id", serverID);
  if (backupID) newEndpoint = newEndpoint.replace(":backup_id", backupID);

  return newEndpoint;
};

export const ApplicationEndpoints = {
  // Users
  users: (id?: string) => {
    if (!id) return "/api/application/users";
    return `/api/application/users/${id}`;
  },

  // Nodes
  nodes: (id?: string, path?: string) => {
    if (!id) return "/api/application/nodes";
    if (path) return `/api/application/nodes/${id}/${path}`;
    return `/api/application/nodes/${id}/${path}`;
  },

  // Node allocations
  allocations: (node_id: string, allocation_id?: string) => {
    if (!allocation_id) return `/api/application/nodes/${node_id}/allocations`;
    return `/api/application/nodes/${node_id}/allocations/${allocation_id}`;
  },

  // Locations
  locations: (id?: string) => {
    if (!id) return "/api/application/locations";
    return `/api/application/locations/${id}`;
  },

  // Servers
  servers: (id?: string, path?: string) => {
    if (!id) return "/api/application/servers";
    if (path) return `/api/application/servers/${id}/${path}`;
    return `/api/application/servers/${id}`;
  },

  serverDatabases: (server_id: string, database_id?: string) => {
    if (!database_id) return `/api/application/servers/${server_id}/databases`;
    return `/api/application/servers/${server_id}/databases/${database_id}`;
  },

  // Nests
  nests: (id?: string) => {
    if (!id) return "/api/application/nests";
    return `/api/application/nests/${id}`;
  },

  // Nest eggs

  nestEggs: (nest_id: string, egg_id?: string) => {
    if (!egg_id) return `/api/application/nests/${nest_id}/eggs`;
    return `/api/application/nests/${nest_id}/eggs/${egg_id}`;
  },
};

export type TApplicationEndpoints =
  (typeof ApplicationEndpoints)[keyof typeof ApplicationEndpoints];
