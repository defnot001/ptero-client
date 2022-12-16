import axios from 'axios';
import type { AuthDetails, BackupOptions } from '../../types/interfaces';
import { ClientEndpoints } from '../../util/clientEndpoints';
import { handleError } from '../../util/handleErrors';
import { getRequestHeaders, getRequestURL } from '../../util/requests';
import {
  BackupDownloadSchema,
  BackupListResponseSchema,
  PterodactylBackup,
} from '../../validation/BackupSchema';
import { ValidationError } from '../errors/Errors';

/**
 * This class is used to manage backups.
 * @public @class BackupManager
 * @param  {AuthDetails} authDetails The authentication details.
 * @returns {BackupManager} The BackupManager instance.
 */
export default class BackupManager {
  private readonly baseURL: string;
  private readonly apiKey: string;

  public constructor(authDetails: AuthDetails) {
    this.baseURL = authDetails.hostURL;
    this.apiKey = authDetails.apiKey;
  }

  /**
   * Lists the Backups of a server.
   * @async @public @method list
   * @param  {string} serverID The ID of the server.
   * @returns {Promise<BackupListResponse>} A list of backups on the server.
   * @throws {ValidationError} If the response is invalid.
   * @throws {PterodactylError} If the request failed because of a Pterodactyl error.
   * @throws {Error} If the request failed.
   */
  public async list(serverID: string) {
    try {
      const { data } = await axios.get(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.listBackups,
          serverID: serverID,
        }),
        getRequestHeaders(this.apiKey),
      );

      const validated = BackupListResponseSchema.safeParse(data);

      if (!validated.success) throw new ValidationError();

      return validated.data;
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

      const { data } = await axios.post(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.createBackup,
          serverID: serverID,
        }),
        { name: backupName, is_locked: locked },
        getRequestHeaders(this.apiKey),
      );

      const validated = PterodactylBackup.safeParse(data);

      if (!validated.success) throw new ValidationError();

      return validated.data;
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
  public async getDetails(serverID: string, backupID: string) {
    try {
      const { data } = await axios.get(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.backupDetails,
          serverID: serverID,
          backupID: backupID,
        }),
        getRequestHeaders(this.apiKey),
      );

      const validated = PterodactylBackup.safeParse(data);

      if (!validated.success) throw new ValidationError();

      return validated.data;
    } catch (err) {
      return handleError(
        err,
        `Cannot get details for ${backupID} of server: ${serverID}!`,
      );
    }
  }

  /**
   * Generates a download link for a backup.
   * @async @public @method download
   * @param {string} serverID The ID of the server.
   * @param {string} backupID The ID of the backup.
   * @returns {Promise<BackupDownloadResponse>} The download link.
   * @throws {ValidationError} If the response is invalid.
   * @throws {PterodactylError} If the request failed because of a Pterodactyl error.
   * @throws {Error} If the request failed.
   */
  public async download(serverID: string, backupID: string) {
    try {
      const { data } = await axios.get(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.downloadBackup,
          serverID: serverID,
          backupID: backupID,
        }),
        getRequestHeaders(this.apiKey),
      );

      const validated = BackupDownloadSchema.safeParse(data);

      if (!validated.success) throw new ValidationError();

      return validated.data;
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
  public async delete(serverID: string, backupID: string) {
    try {
      await axios.delete(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.deleteBackup,
          serverID: serverID,
          backupID: backupID,
        }),
        getRequestHeaders(this.apiKey),
      );

      return;
    } catch (err) {
      return handleError(
        err,
        `Cannot delete ${backupID} from server: ${serverID}!`,
      );
    }
  }
}
