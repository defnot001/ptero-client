import { AxiosInstance } from "axios";
import { ApplicationEndpoints } from "../../util/endpoints";
import { LocationDetails } from "../../validation/LocationSchema";

/**
 * A class that manages the locations. As a user of this library, you don't need to instantiate this class yourself. It is already instantiated in the `PteroClient` class.\
 */
export default class LocationsManager {
  routes: typeof ApplicationEndpoints;
  public constructor(private http: AxiosInstance) {
    this.routes = ApplicationEndpoints;
  }

  public async list(): Promise<LocationDetails[]> {
    const res = await this.http.get(this.routes.locations());
    return res.data;
  }

  public async get(id: string): Promise<LocationDetails> {
    const res = await this.http.get(this.routes.locations(id));
    return res.data;
  }

  public async create(body: {
    short: string;
    long: string;
  }): Promise<LocationDetails> {
    const res = await this.http.post(this.routes.locations(), body);
    return res.data;
  }

  public async update(
    id: string,
    body: {
      short: string;
      long: string;
    }
  ): Promise<LocationDetails> {
    const res = await this.http.patch(this.routes.locations(id), body);
    return res.data;
  }

  public async delete(id: string): Promise<void> {
    const res = await this.http.delete(this.routes.locations(id));
    return res.data;
  }
}
