export const enum ClientEndpoints {
  getAccountDetails = 'api/client/account',
  listServers = 'api/client',
  listFiles = 'api/client/servers/:server_id/files/list?directory=',
  changePowerState = 'api/client/servers/:server_id/power',
  listBackups = 'api/client/servers/:server_id/backups',
  createBackup = 'api/client/servers/:server_id/backups',
  backupDetails = 'api/client/servers/:server_id/backups/:backup_id',
  downloadBackup = 'api/client/servers/:server_id/backups/:backup_id/download',
  deleteBackup = 'api/client/servers/:server_id/backups/:backup_id',
  resourceUsage = 'api/client/servers/:server_id/resources',
}
