import { AxiosInstance } from "axios";
import { ApplicationEndpoints } from "../../util/endpoints";
import { NodeConfiguration, NodeDetails } from "../../validation/NodeSchema";

/**
 * A class that manages the nodes. As a user of this library, you don't need to instantiate this class yourself. It is already instantiated in the `PteroClient` class.\
 */

export default class NodesManager {
  routes: typeof ApplicationEndpoints;
  public constructor(private http: AxiosInstance) {
    this.routes = ApplicationEndpoints;
  }

  public async list(): Promise<NodeDetails[]> {
    const res = await this.http.get(this.routes.nodes());
    return res.data;
  }

  public async get(id: string): Promise<NodeDetails> {
    const res = await this.http.get(this.routes.nodes(id));
    return res.data;
  }

  public async configuration(id: string): Promise<NodeConfiguration> {
    const res = await this.http.get(this.routes.nodes(id, "/configuration"));
    return res.data;
  }

  public async create(body: {
    name: string;
    location_id: string;
    fqdn: string;
    scheme: string;
    memory: number;
    memory_overallocate: number;
    disk: number;
    disk_overallocate: number;
    upload_size: number;
    daemon_listen: string;
    daemon_sftp: string;
  }): Promise<NodeDetails> {
    const res = await this.http.post(this.routes.nodes(), body);
    return res.data;
  }

  public async update(
    id: string,
    body: {
      name?: string;
      location_id?: string;
      fqdn?: string;
      scheme?: string;
      memory?: number;
      memory_overallocate?: number;
      disk?: number;
      disk_overallocate?: number;
      upload_size?: number;
      daemon_listen?: string;
      daemon_sftp?: string;
    }
  ): Promise<NodeDetails> {
    const res = await this.http.patch(this.routes.nodes(id), body);
    return res.data;
  }

  public async delete(id: string): Promise<void> {
    const res = await this.http.delete(this.routes.nodes(id));
    return res.data;
  }
}
