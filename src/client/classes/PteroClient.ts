import axios from 'axios';
import type {
  AccountDetailsResponse,
  AuthDetails,
  BackupCreateResponse,
  BackupListResponse,
  BackupOptions,
  ListServersResponse,
} from '../types/interfaces';
import {
  assertsAccountDetailsResponse,
  assertsBackupCreateResponse,
  assertsBackupListResponse,
  assertsListFilesResponse,
  assertsListServersResponse,
} from '../util/assertions';
import { ClientEndpoints } from '../util/clientEndpoints';
import { getError } from '../util/handleErrors';
import { getRequestHeaders, getRequestURL } from '../util/requests';
import { PterodactylError } from './PterodactylError';

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
   * @throws {Error} If the request failed.
   */
  private async requestChangePowerstate(
    serverID: string,
    action: 'start' | 'stop' | 'restart' | 'kill',
  ): Promise<void> {
    try {
      const { status } = await axios.post(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.changePowerState,
          serverID: serverID,
        }),
        { signal: action },
        getRequestHeaders(this.apiKey),
      );

      if (status !== 204) throw new Error();
    } catch (err) {
      throw new Error(`Failed to ${action} server ${serverID}!`);
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
   * Lists all servers the client has access to.
   * @async @public @method listServers
   * @returns {Promise<ListServersResponse>} The list of servers.
   * @throws {Error} If the request failed.
   */
  public async listServers(): Promise<ListServersResponse> {
    try {
      const { data } = await axios.get(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.listServers,
        }),
        getRequestHeaders(this.apiKey),
      );

      assertsListServersResponse(data);

      return data;
    } catch (err) {
      throw new Error('Failed to list servers!');
    }
  }

  public async listFiles(serverID: string, directory = '/') {
    directory = encodeURIComponent(directory);

    try {
      const { data } = await axios.get(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.listFiles,
          serverID: serverID,
        }) + directory,
        getRequestHeaders(this.apiKey),
      );

      assertsListFilesResponse(data);

      return data;
    } catch (err) {
      const error = getError(err);

      if (!error) {
        throw new Error(`Failed to create backup of server ${serverID}!`);
      }

      throw new PterodactylError(error);
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

      assertsAccountDetailsResponse(data);

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

      assertsBackupListResponse(data);

      return data;
    } catch (err) {
      throw new Error(`Failed to list backups of server ${serverID}!`);
    }
  }

  /**s
   * Creates a backup of a server.
   * @async @public @method createBackup
   * @param  {string} serverID The ID of the server.
   * @param  {BackupOptions} [options] The options for the backup.
   * @returns {Promise<BackupCreateResponse>} The backup.
   * @throws {Error} If the request failed.
   * @throws {PterodactylError} If the request failed because of a Pterodactyl error.
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

      assertsBackupCreateResponse(data);

      return data;
    } catch (err) {
      const error = getError(err);

      if (!error) {
        throw new Error(`Failed to create backup of server ${serverID}!`);
      }

      throw new PterodactylError(error);
    }
  }
}
