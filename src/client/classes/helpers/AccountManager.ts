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
   * An asynchronous method that resolves to the account details of the `client user`.
   * The promise will reject if the request fails.
   * Make sure to `await` the method call and handle potential **errors**.
   * ```ts
   * try {
   * const response = await client.account.getDetails();
   * console.log(response.first_name);
   * // => 'John'
   * } catch (err) {
   * console.error(err);
   * }
   * ```
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
