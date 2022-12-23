import type { AxiosInstance } from 'axios';
import axios from 'axios';
import type { AuthDetails } from '../types/interfaces';
import AccountManager from './helpers/AccountManager';
import BackupManager from './helpers/BackupManager';
import ErrorManager from './helpers/ErrorManager';
import FileManager from './helpers/FileManager';
import ServerManager from './helpers/ServerManager';

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
