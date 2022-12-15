import axios from 'axios';
import type {
  AccountDetailsResponse,
  AuthDetails,
  BackupListResponse,
  BackupOptions,
} from '../types/interfaces';
import { ClientEndpoints } from '../util/clientEndpoints';
import { handleError } from '../util/handleErrors';
import { getRequestHeaders, getRequestURL } from '../util/requests';
import {
  BackupCreateResponse,
  BackupCreateResponseSchema,
} from '../validation/BackupSchema';
import { ListFilesResponseSchema } from '../validation/FileSchema';
import { listServersResponseSchema } from '../validation/listServersSchema';
import { PterodactylError } from './PterodactylError';
import { ValidationError } from './ValidationError';

/**
 * The PteroClient class is the main class of the API wrapper.
 * @public @class PteroClients
 * });
 */
export default class PteroClient {
  private readonly baseURL: string;
  private readonly apiKey: string;

  /**
   * Creates a new PteroClient instance.
   * @public @constructor
   * @param  {AuthDetails} authDetails The authentication details.
   * @throws {Error} If the base URL or API key is missing or invalid.
   * @returns {PteroClient} The PteroClient instance.
   */
  public constructor(authDetails: AuthDetails) {
    this.baseURL = authDetails.hostURL;
    this.apiKey = authDetails.apiKey;

    if (!this.baseURL.trim() || !this.apiKey.trim()) {
      throw new Error('Missing/invalid base URL and/or API key!');
    }
  }

  /**
   * Requests a power state change.
   * @async @private @method requestChangePowerstate
   * @param  {string} serverID The ID of the server.
   * @param  {'start' | 'stop' | 'restart' | 'kill'} action The action to perform.
   * @returns {Promise<void>}
   * @throws {PterodactylError} If the request failed due to an API Error.
   * @throws {Error} If the request failed.
   */
  private async requestChangePowerstate(
    serverID: string,
    action: 'start' | 'stop' | 'restart' | 'kill',
  ): Promise<void> {
    try {
      return await axios.post(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.changePowerState,
          serverID: serverID,
        }),
        { signal: action },
        getRequestHeaders(this.apiKey),
      );
    } catch (err) {
      return handleError(err, `Failed to ${action} server ${serverID}!`);
    }
  }

  /**
   * Checks if the error is a PterodactylError.
   * @public @method isPterodactylError
   * @param  {unknown} error
   * @returns {boolean} Whether the error is a PterodactylError.
   */
  public isPterodactylError(error: unknown): error is PterodactylError {
    return error instanceof PterodactylError;
  }

  /**
   * Checks if the error is a ValidationError.
   * @public @method isValidationError
   * @param  {unknown} error
   * @returns {boolean} Whether the error is a ValidationError.
   */
  public isValidationError(error: unknown): error is ValidationError {
    return error instanceof ValidationError;
  }

  /**
   * Lists all servers the client has access to.
   * @async @public @method listServers
   * @returns {Promise<ListServersResponse>} The list of servers.
   * @throws {APIValidationError} If the response is different than expected.
   * @throws {PterodactylError} If the request failed due to an error on the server.
   * @throws {Error} If the request failed.
   */
  public async listServers() {
    try {
      const { data } = await axios.get(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.listServers,
        }),
        getRequestHeaders(this.apiKey),
      );

      const validated = listServersResponseSchema.safeParse(data);

      if (!validated.success) throw new ValidationError();

      return validated.data;
    } catch (err) {
      return handleError(err, 'Failed to list servers!');
    }
  }

  /**
   * Lists files in a directory.
   * @async @public @method listFiles
   * @param  {string} serverID The ID of the server.
   * @param  {string} [directory='/'] The directory to list.
   * @returns {Promise<ListFilesResponse>} The list of files.
   * @throws {APIValidationError} If the response is different than expected.
   * @throws {PterodactylError} If the request failed due to an error on the server.
   * @throws {Error} If the request failed.
   */
  public async listFiles(serverID: string, directory = '/') {
    const encoded = encodeURIComponent(directory);

    try {
      const { data } = await axios.get(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.listFiles,
          serverID: serverID,
        }) + encoded,
        getRequestHeaders(this.apiKey),
      );

      const validated = ListFilesResponseSchema.safeParse(data);

      if (!validated.success) throw new ValidationError();

      return validated.data;
    } catch (err) {
      return handleError(
        err,
        `Failed to list items for ${serverID} in ${directory}!`,
      );
    }
  }

  /**
   * Gets the account details of the user.
   * @async @public @method getAccountDetails
   * @returns {Promise<AccountDetailsResponse>} The account details.
   * @throws {Error} If the request failed.
   */
  public async getAccountDetails(): Promise<AccountDetailsResponse> {
    try {
      const { data } = await axios.get(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.getAccountDetails,
        }),
        getRequestHeaders(this.apiKey),
      );

      return data;
    } catch (err) {
      throw new Error('Failed to get account details!');
    }
  }

  /**
   * Starts a server.
   * @async @public @method startServer
   * @param  {string} serverID The ID of the server.
   * @returns {Promise<void>}
   * @throws {Error} If the request failed.
   */
  public async startServer(serverID: string): Promise<void> {
    this.requestChangePowerstate(serverID, 'start');
  }

  /**
   * Stops a server.
   * @async @public @method stopServer
   * @param  {string} serverID The ID of the server.
   * @returns {Promise<void>}
   * @throws {Error} If the request failed.
   */
  public async stopServer(serverID: string): Promise<void> {
    this.requestChangePowerstate(serverID, 'stop');
  }

  /**
   * Restarts a server.
   * @async @public @method restartServer
   * @param  {string} serverID The ID of the server.
   * @returns {Promise<void>}
   * @throws {Error} If the request failed.
   */
  public async restartServer(serverID: string): Promise<void> {
    this.requestChangePowerstate(serverID, 'restart');
  }

  /**
   * Kills a server.
   * @async @public @method killServer
   * @param  {string} serverID The ID of the server.
   * @returns {Promise<void>}
   * @throws {Error} If the request failed.
   */
  public async killServer(serverID: string): Promise<void> {
    this.requestChangePowerstate(serverID, 'kill');
  }

  /**
   * Lists the Backups of a server.
   * @async @public @method listBackups
   * @param  {string} serverID The ID of the server.
   * @returns {Promise<BackupListResponse>} The backups.
   * @throws {Error} If the request failed.
   */
  public async listBackups(serverID: string): Promise<BackupListResponse> {
    try {
      const { data } = await axios.get(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.listBackups,
          serverID: serverID,
        }),
        getRequestHeaders(this.apiKey),
      );

      return data;
    } catch (err) {
      throw new Error(`Failed to list backups of server ${serverID}!`);
    }
  }

  /**
   * Creates a backup of a server.
   * @async @public @method createBackup
   * @param  {string} serverID The ID of the server.
   * @param  {BackupOptions} [options] The options for the backup.
   * @returns {Promise<BackupCreateResponse>} The backup.
   * @throws {ValidationError} If the response is invalid.
   * @throws {PterodactylError} If the request failed because of a Pterodactyl error.
   * @throws {Error} If the request failed.
   */
  public async createBackup(
    serverID: string,
    options?: BackupOptions,
  ): Promise<BackupCreateResponse> {
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

      const validated = BackupCreateResponseSchema.safeParse(data);

      if (!validated.success) throw new ValidationError();

      return validated.data;
    } catch (err) {
      return handleError(err, `Failed to create backup of server ${serverID}!`);
    }
  }
}
