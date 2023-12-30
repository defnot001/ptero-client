import axios, { CreateAxiosDefaults, type AxiosInstance } from "axios";

// Client classes
import AccountManager from "./classes/AccountManager";
import BackupManager from "./classes/BackupManager";
import ErrorManager from "./classes/ErrorManager";
import FileManager from "./classes/FileManager";
import ServerManager from "./classes/ServerManager";
//import WebsocketManager from "./classes/WebsocketManager";

// Application classes
import NestsManager from "./classes/application/NestsManager";
import LocationsManager from "./classes/application/LocationsManager";
import NodesManager from "./classes/application/NodesManager";
import AllocationsManager from "./classes/application/AllocationsManager";
import DatabasesManager from "./classes/application/DatabasesManager";
import EggsManager from "./classes/application/EggsManager";
import UsersManager from "./classes/application/UsersManager";

// Types
import type { AuthDetails } from "./types/types";

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

  //public socket: WebsocketManager;

  /**
   * Application Managers
   */

  /**
   * The `AllocationsManager` class, used to manage allocations.
   * Can be accessed using `client.allocations`.
   */
  public allocations: AllocationsManager;

  /**
   * The `DatabaseManager` class, used to manage databases.
   * Can be accessed using `client.databases`.
   */
  public databases: DatabasesManager;

  /**
   * The `EggsManager` class, used to manage eggs.
   * Can be accessed using `client.eggs`.
   */
  public eggs: EggsManager;

  /**
   * The `LocationsManager` class, used to manage locations.
   * Can be accessed using `client.locations`.
   */
  public locations: LocationsManager;

  /**
   * The `NestsManager` class, used to manage nests.
   * Can be accessed using `client.nests`.
   */
  public nests: NestsManager;

  /**
   * The `NodesManager` class, used to manage nodes.
   */
  public nodes: NodesManager;

  /**
   * The `ServersManager` class, used to manage servers.
   * Can be accessed using `client.servers`.
   */
  public app_servers: ServerManager;

  /**
   * The `UsersManager` class, used to manage users.
   * Can be accessed using `client.users`.
   */
  public users: UsersManager;

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
  private client_http: AxiosInstance;
  private application_http: AxiosInstance;

  public constructor(authDetails: AuthDetails) {
    this.authDetails = authDetails;

    if (!this.authDetails.baseURL.trim()) {
      throw new Error("Missing/invalid base URL and/or API key!");
    }

    if (!this.authDetails.clientKey.trim()) {
      console.warn("Missing/invalid client key!");
    }

    if (!this.authDetails.applicationKey.trim()) {
      console.warn("Missing/invalid application key!");
    }

    const config = (token: string): CreateAxiosDefaults => {
      return {
        baseURL: this.authDetails.baseURL,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
    };

    this.client_http = axios.create(config(this.authDetails.clientKey));

    this.application_http = axios.create(
      config(this.authDetails.applicationKey)
    );

    // Client classes
    this.files = new FileManager(this.client_http);
    this.backups = new BackupManager(this.client_http);
    this.servers = new ServerManager(this.client_http);
    this.account = new AccountManager(this.client_http);
    //this.socket = new WebsocketManager(this.client_http);

    // Application classes
    this.allocations = new AllocationsManager(this.application_http);
    this.databases = new DatabasesManager(this.application_http);
    this.eggs = new EggsManager(this.application_http);
    this.locations = new LocationsManager(this.application_http);
    this.nests = new NestsManager(this.application_http);
    this.nodes = new NodesManager(this.application_http);
    this.app_servers = new ServerManager(this.application_http);
    this.users = new UsersManager(this.application_http);

    // Error class
    this.errors = new ErrorManager();
  }
}

export type { AuthDetails, BackupOptions, RenameOptions } from "./types/types";
export type { AccountDetails } from "./validation/AccountSchema";
export type {
  PterodactylBackup,
  PterodactylBackupListMeta,
} from "./validation/BackupSchema";
export type { PterodactylFile } from "./validation/FileSchema";
export type { PterodactylServer } from "./validation/ServerSchema";
