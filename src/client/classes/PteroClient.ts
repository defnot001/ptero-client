import type { AuthDetails } from '../types/interfaces';
import AccountManager from './helpers/AccountManager';
import BackupManager from './helpers/BackupManager';
import ErrorManager from './helpers/ErrorManager';
import FileManager from './helpers/FileManager';
import PowerstateManager from './helpers/PowerstateManager';
import ServerManager from './helpers/ServerManager';

/**
 * The PteroClient class is the main class of the API wrapper.
 * @public @class PteroClients
 * });
 */
export default class PteroClient {
  private readonly baseURL: string;
  private readonly apiKey: string;

  public files: FileManager;
  public backups: BackupManager;
  public servers: ServerManager;
  public power: PowerstateManager;
  public account: AccountManager;
  public errors: ErrorManager;

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

    this.files = new FileManager(authDetails);
    this.backups = new BackupManager(authDetails);
    this.servers = new ServerManager(authDetails);
    this.power = new PowerstateManager(authDetails);
    this.account = new AccountManager(authDetails);
    this.errors = new ErrorManager();
  }
}
