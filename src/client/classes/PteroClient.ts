import axios from 'axios';
import type {
  AuthDetails,
  PteroBackupCreateResponseData,
  PteroBackupListResponseData,
} from '../types/interfaces';
import { assertsPteroBackupCreateResponseData } from '../util/assertions';
import { ClientEndpoints } from '../util/clientEndpoints';
import { getError, isPteroAPIError } from '../util/handleErrors';
import { getRequestHeaders, getRequestURL } from '../util/requests';
import { PterodactylError } from './PterodactylError';

export default class PteroClient {
  private readonly baseURL: string;
  private readonly apiKey: string;

  public constructor(authDetails: AuthDetails) {
    this.baseURL = authDetails.hostURL;
    this.apiKey = authDetails.apiKey;

    if (!this.baseURL.trim() || !this.apiKey.trim()) {
      throw new Error('Missing/invalid base URL and/or API key!');
    }
  }

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

      if (axios.isAxiosError(status) || status !== 204) {
        throw new Error();
      }
    } catch (err) {
      throw new Error(
        `Failed to change powerstate (${action}) of server ${serverID}!`,
      );
    }
  }

  public async startServer(serverID: string) {
    this.requestChangePowerstate(serverID, 'start');
  }

  public async stopServer(serverID: string) {
    this.requestChangePowerstate(serverID, 'stop');
  }

  public async restartServer(serverID: string) {
    this.requestChangePowerstate(serverID, 'restart');
  }

  public async killServer(serverID: string) {
    this.requestChangePowerstate(serverID, 'kill');
  }

  public async listBackups(serverID: string) {
    try {
      const { data } = await axios.get(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.listBackups,
          serverID: serverID,
        }),
        getRequestHeaders(this.apiKey),
      );

      const isBackup = (data: unknown): data is PteroBackupListResponseData => {
        return (
          typeof data === 'object' &&
          data !== null &&
          'object' in data &&
          data.object === 'list'
        );
      };

      if (axios.isAxiosError(data) || !isBackup(data)) {
        throw new Error();
      }

      return data;
    } catch (err) {
      throw new Error(`Failed to list backups of server ${serverID}!`);
    }
  }

  public async createBackup(
    serverID: string,
    backupName?: string,
    locked: boolean = false,
  ): Promise<PteroBackupCreateResponseData> {
    const name = backupName
      ? backupName
      : `Backup at ${new Date()} with pteroclient API wrapper.`;

    try {
      const { data } = await axios.post(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.createBackup,
          serverID: serverID,
        }),
        { name: name, is_locked: locked },
        getRequestHeaders(this.apiKey),
      );

      assertsPteroBackupCreateResponseData(data);

      return data;
    } catch (err) {
      const error = getError(err);

      if (isPteroAPIError(error)) {
        throw new PterodactylError(error);
      }

      throw new Error(`Failed to create backup of server ${serverID}!`);
    }
  }

  public isPterodactylError(error: unknown): error is PterodactylError {
    return error instanceof PterodactylError;
  }
}
