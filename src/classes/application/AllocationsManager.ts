import { AxiosInstance } from "axios";
import { ApplicationEndpoints } from "../../util/endpoints";

/**
 * A class that manages the nodes. As a user of this library, you don't need to instantiate this class yourself. It is already instantiated in the `PteroClient` class.\
 */
export default class AllocationsManager {
  routes: typeof ApplicationEndpoints;
  public constructor(private http: AxiosInstance) {
    this.routes = ApplicationEndpoints;
  }

  public async list(nodeId: string) {
    const res = await this.http.get(this.routes.allocations(nodeId));
    return res.data;
  }

  public async create(nodeId: string, body: any) {
    const res = await this.http.post(this.routes.allocations(nodeId), body);
    return res.data;
  }

  public async delete(nodeId: string, allocationId: string) {
    const res = await this.http.delete(
      this.routes.allocations(nodeId, allocationId)
    );
    return res.data;
  }
}
