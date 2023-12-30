import { AxiosInstance } from "axios";
import { ApplicationEndpoints } from "../../util/endpoints";
import { NestDetails } from "../../validation/NestSchema";

/**
 * A class that manages the nests. As a user of this library, you don't need to instantiate this class yourself. It is already instantiated in the `PteroClient` class.\
 */

export default class NestsManager {
  routes: typeof ApplicationEndpoints;
  public constructor(private http: AxiosInstance) {
    this.routes = ApplicationEndpoints;
  }

  public async list(): Promise<NestDetails[]> {
    const res = await this.http.get(this.routes.nests());
    return res.data;
  }

  public async get(id: string): Promise<NestDetails> {
    const res = await this.http.get(this.routes.nests(id));
    return res.data;
  }
}
