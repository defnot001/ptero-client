import axios from 'axios';
import type { AuthDetails } from '../../types/interfaces';
import { ClientEndpoints } from '../../util/clientEndpoints';
import { handleError } from '../../util/handleErrors';
import { getRequestHeaders, getRequestURL } from '../../util/requests';

export default class PowerstateManager {
  private readonly baseURL: string;
  private readonly apiKey: string;

  public constructor(authDetails: AuthDetails) {
    this.baseURL = authDetails.hostURL;
    this.apiKey = authDetails.apiKey;
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
      return await axios.post(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.changePowerState,
          serverID: serverID,
        }),
        { signal: action },
        getRequestHeaders(this.apiKey),
      );
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
