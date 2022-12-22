import type { AxiosInstance } from 'axios';
import { ClientEndpoints } from '../../util/clientEndpoints';
import { handleError } from '../../util/handleErrors';
import { validateResponse } from '../../util/zodValidation';
import {
  AccountDetails,
  AccountDetailsResponse,
  AccountDetailsResponseSchema,
} from '../../validation/AccountSchema';

export default class AccountManager {
  public constructor(private http: AxiosInstance) {}
  /**
   * Gets the account details of the user.
   * @async @public @method getDetails
   * @returns {Promise<AccountDetailsResponse>} The account details.
   * @throws {APIValidationError} If the response is different than expected.
   * @throws {PterodactylError} If the request failed due to an error on the server.
   * @throws {Error} If the request failed.
   */
  public async getDetails(): Promise<AccountDetails> {
    try {
      const { data } = await this.http.get<AccountDetailsResponse>(
        ClientEndpoints.getAccountDetails,
      );

      const validated = validateResponse(AccountDetailsResponseSchema, data);

      return validated.attributes;
    } catch (err) {
      return handleError(err, 'Failed to get the account details!');
    }
  }
}
