import axios from 'axios';
import type { AuthDetails } from '../types/interfaces';
import {
  assertsPteroBackupCreateResponseData,
  assertsPteroBackupListResponseData,
} from '../util/assertions';
import { ClientEndpoints } from '../util/clientEndpoints';
import { getError } from '../util/handleErrors';
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

      if (status !== 204) throw new Error();
    } catch (err) {
      throw new Error(`Failed to ${action} server ${serverID}!`);
    }
  }

  public isPterodactylError(error: unknown): error is PterodactylError {
    return error instanceof PterodactylError;
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

      assertsPteroBackupListResponseData(data);

      return data;
    } catch (err) {
      const error = getError(err);

      if (!error) {
        throw new Error(`Failed to list backups of server ${serverID}!`);
      }

      throw new PterodactylError(error);
    }
  }

  public async createBackup(
    serverID: string,
    backupName: string = `Backup at ${new Date()} with pteroclient API wrapper.`,
    locked: boolean = false,
  ) {
    try {
      const { data } = await axios.post(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.createBackup,
          serverID: serverID,
        }),
        { name: backupName, is_locked: locked },
        getRequestHeaders(this.apiKey),
      );

      assertsPteroBackupCreateResponseData(data);

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
