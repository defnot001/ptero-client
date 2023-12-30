import { AxiosInstance } from "axios";
import { ApplicationEndpoints } from "../../util/endpoints";
import { EggDetails } from "../../validation/EggSchema";

/**
 * A class that manages the eggs. As a user of this library, you don't need to instantiate this class yourself. It is already instantiated in the `PteroClient` class.\
 */

export default class EggsManager {
  routes: typeof ApplicationEndpoints;
  public constructor(private http: AxiosInstance) {
    this.routes = ApplicationEndpoints;
  }

  public async list(nestId: string): Promise<EggDetails[]> {
    const res = await this.http.get(this.routes.nestEggs(nestId));
    return res.data;
  }

  public async get(nestId: string, id: string): Promise<EggDetails> {
    const res = await this.http.get(this.routes.nestEggs(nestId, id));
    return res.data;
  }
}
