import axios, { type AxiosInstance } from 'axios';
import AccountManager from './classes/AccountManager';
import BackupManager from './classes/BackupManager';
import ErrorManager from './classes/ErrorManager';
import FileManager from './classes/FileManager';
import ServerManager from './classes/ServerManager';
import WebsocketManager from './classes/WebsocketManager';
import type { AuthDetails } from './types/types';

/**
 * The PteroClient class is the main class of the API wrapper.
 * It is the only class that is exported by default.
 * ```ts
 * import PteroClient from ts-ptero-wrapper;
 *
 * const client = new PteroClient({
 *  baseURL: 'https://example.com',
 *  apiKey: 'your-api-key',
 * });
 * ```
 */
export class PteroClient {
  public authDetails: AuthDetails;

  /**
   * The `FileManager` class, used to manage files on the server.
   * Can be accessed using `client.files`.
   */
  public files: FileManager;

  /**
   * The `BackupManager` class, used to manage backups on the server.
   * Can be accessed using `client.backups`.
   */
  public backups: BackupManager;

  /**
   * The `ServerManager` class, used to manage servers.
   * Can be accessed using `client.servers`.
   */
  public servers: ServerManager;

  /**
   * The `AccountManager` class, used to manage the account.
   * Can be accessed using `client.account`.
   */
  public account: AccountManager;
  public socket: WebsocketManager;

  /**
   * The `ErrorManager` class, used to manage errors.
   * Can be accessed using `client.errors`.
   */
  public errors: ErrorManager;

  /**
   * The `HTTP client` used to make requests to the API.
   * As it is `private`, it is not accessible to the user if they are using TypeScript.
   * In JavaScript, it is accessible, but it is **not** recommended to use it.
   */
  private _http: AxiosInstance;

  public constructor(authDetails: AuthDetails) {
    this.authDetails = authDetails;

    if (!this.authDetails.baseURL.trim() || !this.authDetails.apiKey.trim()) {
      throw new Error('Missing/invalid base URL and/or API key!');
    }

    this._http = axios.create({
      baseURL: this.authDetails.baseURL,
      headers: {
        Authorization: `Bearer ${this.authDetails.apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.files = new FileManager(this._http);
    this.backups = new BackupManager(this._http);
    this.servers = new ServerManager(this._http);
    this.account = new AccountManager(this._http);
    this.errors = new ErrorManager();
    this.socket = new WebsocketManager(this._http);
  }
}

export type { AuthDetails, BackupOptions, RenameOptions } from './types/types';
export type { AccountDetails } from './validation/AccountSchema';
export type {
  PterodactylBackup,
  PterodactylBackupListMeta,
} from './validation/BackupSchema';
export type { PterodactylFile } from './validation/FileSchema';
export type { PterodactylServer } from './validation/ServerSchema';
