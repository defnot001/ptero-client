import axios from 'axios';
import type { AuthDetails } from '../../types/interfaces';
import { ClientEndpoints } from '../../util/clientEndpoints';
import { handleError } from '../../util/handleErrors';
import { getRequestHeaders, getRequestURL } from '../../util/requests';
import { listServersResponseSchema } from '../../validation/ServerSchema';
import { ValidationError } from '../errors/Errors';

export default class ServerManager {
  private readonly baseURL: string;
  private readonly apiKey: string;

  constructor(authDetails: AuthDetails) {
    this.baseURL = authDetails.hostURL;
    this.apiKey = authDetails.apiKey;
  }

  /**
   * Lists all servers the client has access to.
   * @async @public @method list
   * @returns {Promise<ListServersResponse>} The list of servers.
   * @throws {APIValidationError} If the response is different than expected.
   * @throws {PterodactylError} If the request failed due to an error on the server.
   * @throws {Error} If the request failed.
   */
  public async list() {
    try {
      const { data } = await axios.get(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.listServers,
        }),
        getRequestHeaders(this.apiKey),
      );

      const validated = listServersResponseSchema.safeParse(data);

      if (!validated.success) throw new ValidationError();

      return validated.data;
    } catch (err) {
      return handleError(err, 'Failed to list servers!');
    }
  }
}
