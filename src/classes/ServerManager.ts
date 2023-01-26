import type { AxiosInstance } from 'axios';
import { ClientEndpoints, replaceVariables } from '../util/endpoints';
import { handleError } from '../util/handleErrors';
import { validateResponse } from '../util/helpers';
import {
  ListServersResponse,
  PterodactylServer,
  ServerUsage,
  ServerUsageResponse,
  listServersResponseSchema,
  serverUsageSchema,
} from '../validation/ServerSchema';

export default class ServerManager {
  public constructor(private http: AxiosInstance) {}

  /**
   * An `async` method that resolves to an array of PterodactlServers.
   * The promise will reject if the request fails.
   *
   * Make sure to `await` the method call and handle potential **errors**.
   * ```ts
   * const servers = await client.servers.list();
   * ```
   */
  public async list(): Promise<PterodactylServer[]> {
    try {
      const { data } = await this.http.get<ListServersResponse>(
        ClientEndpoints.listServers,
      );

      const validated = validateResponse(listServersResponseSchema, data);

      return validated.data.map((server) => ({
        ...server.attributes,
      }));
    } catch (err) {
      return handleError(err, 'Failed to list servers!');
    }
  }

  public async getResourceUsage(serverID: string): Promise<ServerUsage> {
    const url = replaceVariables(ClientEndpoints.resourceUsage, {
      serverID,
    });

    try {
      const { data } = await this.http.get<ServerUsageResponse>(url);

      const validated = validateResponse(serverUsageSchema, data);

      return validated.attributes;
    } catch (err) {
      return handleError(
        err,
        `Failed to get resource usage for server ${serverID}!`,
      );
    }
  }

  /**
   * A private `async` method that changes the power state of a server.
   * As this method is private, it is not exposed to the user if they are using TypeScript.
   * For JavaScript users, this method is exposed but should **not** be used.
   */
  private async _changePowerstate(
    serverID: string,
    action: 'start' | 'stop' | 'restart' | 'kill',
  ): Promise<void> {
    try {
      const url = replaceVariables(ClientEndpoints.changePowerState, {
        serverID,
      });

      await this.http.post(url, { signal: action });
    } catch (err) {
      return handleError(err, `Failed to ${action} server ${serverID}!`);
    }
  }

  /**
   * An `async` method that starts a server.
   * The promise will reject if the request fails.
   * @param {string} serverID The ID of the server.
   *
   * Make sure to `await` the method call and handle potential **errors**.
   * ```ts
   * await client.servers.start('fe564c9a');
   * ```
   */
  public async start(serverID: string) {
    this._changePowerstate(serverID, 'start');
  }

  /**
   * An `async` method that stops a server.
   * The promise will reject if the request fails.
   * @param {string} serverID The ID of the server.
   *
   * Make sure to `await` the method call and handle potential **errors**.
   * ```ts
   * await client.servers.stop('fe564c9a');
   * ```
   */
  public async stop(serverID: string) {
    this._changePowerstate(serverID, 'stop');
  }

  /**
   * An `async` method that restarts a server.
   * The promise will reject if the request fails.
   * @param {string} serverID The ID of the server.
   *
   * Make sure to `await` the method call and handle potential **errors**.
   * ```ts
   * await client.servers.restart('fe564c9a');
   * ```
   */
  public async restart(serverID: string) {
    this._changePowerstate(serverID, 'restart');
  }

  /**
   * An `async` method that kills a server.
   * The promise will reject if the request fails.
   * @param {string} serverID The ID of the server.
   *
   * Make sure to `await` the method call and handle potential **errors**.
   * ```ts
   * await client.servers.kill('fe564c9a');
   * ```
   */
  public async kill(serverID: string) {
    this._changePowerstate(serverID, 'kill');
  }

  /**
   * An `async` method that sends a command to a server.
   * The promise will reject if the request fails.
   * @param {string} serverID The ID of the server.
   * @param {string} command The command to send to the server.
   *
   * Make sure to `await` the method call and handle potential **errors**.
   * ```ts
   * await client.servers.sendCommand('fe564c9a', 'say Hello World!');
   * ```
   */
  public async sendCommand(serverID: string, command: string) {
    const url = replaceVariables(ClientEndpoints.sendCommand, {
      serverID,
    });

    try {
      const { data } = await this.http.post<string | undefined>(url, {
        command,
      });

      return data;
    } catch (err) {
      return handleError(err, `Failed to send command to server ${serverID}!`);
    }
  }
}
