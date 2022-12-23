import type { AxiosInstance } from 'axios';
import type { BackupOptions } from '../../types/interfaces';
import { ClientEndpoints, replaceVariables } from '../../util/clientEndpoints';
import { handleError } from '../../util/handleErrors';
import { validateResponse } from '../../util/zodValidation';
import {
  BackupAttributes,
  BackupDownloadResponse,
  BackupDownloadSchema,
  BackupListResponse,
  BackupListResponseSchema,
  BackupResponse,
  BackupResponseSchema,
  PterodactylBackup,
  PterodactylBackupListMeta,
} from '../../validation/BackupSchema';

export default class BackupManager {
  public constructor(private http: AxiosInstance) {}

  private transformBackup(backup: BackupAttributes): PterodactylBackup {
    return {
      ...backup,
      created_at: new Date(backup.created_at),
      completed_at: backup.completed_at ? new Date(backup.completed_at) : null,
    };
  }

  /**
   * Lists the Backups of a server.
   * @async @public @method list
   * @param {string} serverID The ID of the server.
   * @returns {Promise<{ data: PterodactylBackup[]; meta: PterodactylBackupListMeta }>} A list of backups on the server and the meta data.
   * @throws {ValidationError} If the response is invalid.
   * @throws {PterodactylError} If the request failed because of a Pterodactyl error.
   * @throws {Error} If the request failed.
   */
  public async list(
    serverID: string,
  ): Promise<{ data: PterodactylBackup[]; meta: PterodactylBackupListMeta }> {
    const url = replaceVariables(ClientEndpoints.listBackups, { serverID });
    try {
      const { data } = await this.http.get<BackupListResponse>(url);

      const validated = validateResponse(BackupListResponseSchema, data);

      const backupList: PterodactylBackup[] = validated.data.map((backup) =>
        this.transformBackup(backup.attributes),
      );

      return { data: backupList, meta: validated.meta };
    } catch (err) {
      return handleError(err, `Failed to list backups for ${serverID}!`);
    }
  }

  /**
   * Creates a backup of a server.
   * @async @public @method create
   * @param  {string} serverID The ID of the server.
   * @param  {BackupOptions} [options] The options for the backup.
   * @returns {Promise<BackupCreateResponse>} The backup.
   * @throws {ValidationError} If the response is invalid.
   * @throws {PterodactylError} If the request failed because of a Pterodactyl error.
   * @throws {Error} If the request failed.
   */
  public async create(
    serverID: string,
    options?: BackupOptions,
  ): Promise<PterodactylBackup> {
    try {
      const backupName =
        options?.backupName || `Backup at ${new Date()} with ptero-client.`;

      const locked = options?.locked || false;

      const url = replaceVariables(ClientEndpoints.createBackup, { serverID });

      const { data } = await this.http.post<BackupResponse>(url, {
        name: backupName,
        is_locked: locked,
      });

      const { attributes } = validateResponse(BackupResponseSchema, data);

      return this.transformBackup(attributes);
    } catch (err) {
      return handleError(err, `Failed to create backup of server ${serverID}!`);
    }
  }

  /**
   * Gets the details of a backup.
   * @async @public @method getDetails
   * @param {string} serverID The ID of the server.
   * @param {string} backupID The ID of the backup.
   * @returns {Promise<PterodactylBackup>} The details of the backup.
   * @throws {ValidationError} If the response is invalid.
   * @throws {PterodactylError} If the request failed because of a Pterodactyl error.
   * @throws {Error} If the request failed.
   */
  public async getDetails(
    serverID: string,
    backupID: string,
  ): Promise<PterodactylBackup> {
    const url = replaceVariables(ClientEndpoints.backupDetails, {
      serverID,
      backupID,
    });

    try {
      const { data } = await this.http.get<BackupResponse>(url);
      const { attributes } = validateResponse(BackupResponseSchema, data);

      return this.transformBackup(attributes);
    } catch (err) {
      return handleError(
        err,
        `Cannot get details for ${backupID} of server: ${serverID}!`,
      );
    }
  }

  /**
   * Generates a download link for a backup.
   * @async @public @method getDownloadLink
   * @param {string} serverID The ID of the server.
   * @param {string} backupID The ID of the backup.
   * @returns {Promise<string>} The download link.
   * @throws {ValidationError} If the response is invalid.
   * @throws {PterodactylError} If the request failed because of a Pterodactyl error.
   * @throws {Error} If the request failed.
   */
  public async getDownloadLink(
    serverID: string,
    backupID: string,
  ): Promise<string> {
    const url = replaceVariables(ClientEndpoints.downloadBackup, {
      serverID,
      backupID,
    });

    try {
      const { data } = await this.http.get<BackupDownloadResponse>(url);
      const { attributes } = validateResponse(BackupDownloadSchema, data);

      return attributes.url;
    } catch (err) {
      return handleError(
        err,
        `Cannot get a download link for ${backupID} of server: ${serverID}!`,
      );
    }
  }

  /**
   * Deletes a backup.
   * @async @public @method delete
   * @param {string} serverID The ID of the server.
   * @param {string} backupID The ID of the backup.
   * @returns {Promise<void>}
   * @throws {PterodactylError} If the request failed because of a Pterodactyl error.
   * @throws {Error} If the request failed.
   */
  public async delete(serverID: string, backupID: string): Promise<void> {
    const url = replaceVariables(ClientEndpoints.deleteBackup, {
      serverID,
      backupID,
    });

    try {
      await this.http.delete(url);
      return;
    } catch (err) {
      return handleError(
        err,
        `Cannot delete ${backupID} from server: ${serverID}!`,
      );
    }
  }
}
