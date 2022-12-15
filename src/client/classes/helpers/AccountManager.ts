import axios from 'axios';
import type { AuthDetails } from '../../types/interfaces';
import { ClientEndpoints } from '../../util/clientEndpoints';
import { handleError } from '../../util/handleErrors';
import { getRequestHeaders, getRequestURL } from '../../util/requests';
import { AccountDetailsResponseSchema } from '../../validation/AccountSchema';
import { ValidationError } from '../errors/Errors';

export default class AccountManager {
  private readonly baseURL: string;
  private readonly apiKey: string;

  public constructor(authDetails: AuthDetails) {
    this.baseURL = authDetails.hostURL;
    this.apiKey = authDetails.apiKey;
  }

  /**
   * Gets the account details of the user.
   * @async @public @method getDetails
   * @returns {Promise<AccountDetailsResponse>} The account details.
   * @throws {APIValidationError} If the response is different than expected.
   * @throws {PterodactylError} If the request failed due to an error on the server.
   * @throws {Error} If the request failed.
   */
  public async getDetails() {
    try {
      const { data } = await axios.get(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.getAccountDetails,
        }),
        getRequestHeaders(this.apiKey),
      );

      const validated = AccountDetailsResponseSchema.safeParse(data);

      if (!validated.success) throw new ValidationError();

      return validated.data;
    } catch (err) {
      return handleError(err, 'Failed to get the account details!');
    }
  }
}
