import type { AxiosInstance } from 'axios';
import axios from 'axios';
import AccountManager from './classes/AccountManager';
import BackupManager from './classes/BackupManager';
import ErrorManager from './classes/ErrorManager';
import FileManager from './classes/FileManager';
import ServerManager from './classes/ServerManager';
import type { AuthDetails } from './types/interfaces';

/**
 * The PteroClient class is the main class of the API wrapper.
 * @public @class PteroClients
 * });
 */
export default class PteroClient {
  public files: FileManager;
  public backups: BackupManager;
  public servers: ServerManager;
  public account: AccountManager;
  public errors: ErrorManager;
  private http: AxiosInstance;

  public constructor(private authDetails: AuthDetails) {
    this.authDetails = authDetails;

    if (!this.authDetails.baseURL.trim() || !this.authDetails.apiKey.trim()) {
      throw new Error('Missing/invalid base URL and/or API key!');
    }

    this.http = axios.create({
      baseURL: this.authDetails.baseURL,
      headers: {
        Authorization: `Bearer ${this.authDetails.apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.files = new FileManager(this.http);
    this.backups = new BackupManager(this.http);
    this.servers = new ServerManager(this.http);
    this.account = new AccountManager(this.http);
    this.errors = new ErrorManager();
  }
}
