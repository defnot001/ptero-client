import type { AxiosInstance } from 'axios';
import { ClientEndpoints } from '../util/endpoints';
import { handleError } from '../util/handleErrors';
import { validateResponse } from '../util/helpers';
import {
  AccountDetails,
  AccountDetailsResponse,
  AccountDetailsResponseSchema,
} from '../validation/AccountSchema';

/**
 * A class that manages the user account. As a user of this library, you don't need to instantiate this class yourself. It is already instantiated in the `PteroClient` class.\
 * \
 * The AccountManager takes in an `AxiosInstance` as a constructor parameter. This is the `http` instance of the `PteroClient` class.
 */
export default class AccountManager {
  public constructor(private http: AxiosInstance) {}
  /**
   * An **asynchronous method that resolves to the account details of the `client user`.
   * The promise will reject if the request fails.
   * Make sure to `await` the method call and handle potential **errors**.
   * ```ts
   * const response = await client.account.getDetails();
   * console.log(response.first_name);
   * // => 'John'
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
