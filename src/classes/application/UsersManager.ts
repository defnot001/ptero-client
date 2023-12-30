import { AxiosInstance } from "axios";
import { ApplicationEndpoints } from "../../util/endpoints";
import { AccountDetails } from "../../validation/AccountSchema";

/**
 * A class that manages the users. As a user of this library, you don't need to instantiate this class yourself. It is already instantiated in the `PteroClient` class.\
 */

export default class UsersManager {
  routes: typeof ApplicationEndpoints;
  public constructor(private http: AxiosInstance) {
    this.routes = ApplicationEndpoints;
  }

  public async list(): Promise<AccountDetails[]> {
    const res = await this.http.get(this.routes.users());
    return res.data;
  }

  public async get(id: string): Promise<AccountDetails> {
    const res = await this.http.get(this.routes.users(id));
    return res.data;
  }

  public async create(body: {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
  }): Promise<AccountDetails> {
    const res = await this.http.post(this.routes.users(), body);
    return res.data;
  }

  public async update(
    id: string,
    body: {
      email: string;
      username: string;
      first_name: string;
      last_name: string;
      language: string;
      password: string;
    }
  ) {
    const res = await this.http.patch(this.routes.users(id), body);
    return res.data;
  }

  public async delete(id: string): Promise<void> {
    const res = await this.http.delete(this.routes.users(id));
    return res.data;
  }
}
