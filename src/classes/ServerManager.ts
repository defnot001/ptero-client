import type { AxiosInstance } from 'axios';
import { ClientEndpoints, replaceVariables } from '../util/clientEndpoints';
import { handleError } from '../util/handleErrors';
import { validateResponse } from '../util/zodValidation';
import {
  ListServersResponse,
  PterodactylServer,
  listServersResponseSchema,
} from '../validation/ServerSchema';

export default class ServerManager {
  public constructor(private http: AxiosInstance) {}

  /**
   * Lists all servers the client has access to.
   * @async @public @method list
   * @returns {Promise<PterodactylServer[]>} The list of servers.
   * @throws {APIValidationError} If the response is different than expected.
   * @throws {PterodactylError} If the request failed due to an error on the server.
   * @throws {Error} If the request failed.
   * @example const servers = await client.servers.list();
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

  /**
   * Requests a power state change.
   * @async @private @method changePowerstate
   * @param  {string} serverID The ID of the server.
   * @param  {'start' | 'stop' | 'restart' | 'kill'} action The action to perform.
   * @returns {Promise<void>}
   * @throws {PterodactylError} If the request failed due to an API Error.
   * @throws {Error} If the request failed.
   */
  private async changePowerstate(
    serverID: string,
    action: 'start' | 'stop' | 'restart' | 'kill',
  ): Promise<void> {
    try {
      const url = replaceVariables(ClientEndpoints.changePowerState, {
        serverID,
      });

      console.log(url);

      await this.http.post(url, { signal: action });
    } catch (err) {
      return handleError(err, `Failed to ${action} server ${serverID}!`);
    }
  }

  /**
   * Starts a server.
   * @async @public @method start
   * @param  {string} serverID The ID of the server.
   * @returns {Promise<void>}
   * @throws {PterodactylError} If the request failed due to an API Error.
   * @throws {Error} If the request failed.
   */
  public async start(serverID: string) {
    this.changePowerstate(serverID, 'start');
  }

  /**
   * Stops a server.
   * @async @public @method stop
   * @param  {string} serverID The ID of the server.
   * @returns {Promise<void>}
   * @throws {PterodactylError} If the request failed due to an API Error.
   * @throws {Error} If the request failed.
   */
  public async stop(serverID: string) {
    this.changePowerstate(serverID, 'stop');
  }

  /**
   * Restarts a server.
   * @async @public @method restart
   * @param  {string} serverID The ID of the server.
   * @returns {Promise<void>}
   * @throws {PterodactylError} If the request failed due to an API Error.
   * @throws {Error} If the request failed.
   */
  public async restart(serverID: string) {
    this.changePowerstate(serverID, 'restart');
  }

  /**
   * Kills a server.
   * @async @public @method kill
   * @param  {string} serverID The ID of the server.
   * @returns {Promise<void>}
   * @throws {PterodactylError} If the request failed due to an API Error.
   * @throws {Error} If the request failed.
   */
  public async kill(serverID: string) {
    this.changePowerstate(serverID, 'kill');
  }
}
