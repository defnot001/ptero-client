import axios from 'axios';
import type { AuthDetails } from '../../types/interfaces';
import { ClientEndpoints } from '../../util/clientEndpoints';
import { handleError } from '../../util/handleErrors';
import { getRequestHeaders, getRequestURL } from '../../util/requests';
import { ListFilesResponseSchema } from '../../validation/FileSchema';
import { ValidationError } from '../errors/Errors';

export default class FileManager {
  private readonly baseURL: string;
  private readonly apiKey: string;

  constructor(authDetails: AuthDetails) {
    this.baseURL = authDetails.hostURL;
    this.apiKey = authDetails.apiKey;
  }

  /**
   * Lists the files of a server.
   * @async @public @method list
   * @param  {string} serverID The ID of the server.
   * @param  {string} [directory='/'] The directory to list.
   * @returns {Promise<ListFilesResponse>} The list of files.
   * @throws {APIValidationError} If the response is different than expected.
   * @throws {PterodactylError} If the request failed due to an error on the server.
   * @throws {Error} If the request failed.
   */
  public async list(serverID: string, directory = '/') {
    const encoded = encodeURIComponent(directory);

    try {
      const { data } = await axios.get(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.listFiles,
          serverID: serverID,
        }) + encoded,
        getRequestHeaders(this.apiKey),
      );

      const validated = ListFilesResponseSchema.safeParse(data);

      if (!validated.success) throw new ValidationError();

      return validated.data;
    } catch (err) {
      return handleError(
        err,
        `Failed to list items for ${serverID} in ${directory}!`,
      );
    }
  }
}
