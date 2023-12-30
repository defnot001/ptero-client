import { AxiosInstance } from "axios";
import { ApplicationEndpoints } from "../../util/endpoints";
import { DatabaseDetails } from "../../validation/DatabaseSchema";

/**
 * A class that manages the databases. As a user of this library, you don't need to instantiate this class yourself. It is already instantiated in the `PteroClient` class.\
 */

export default class DatabasesManager {
  routes: typeof ApplicationEndpoints;
  public constructor(private http: AxiosInstance) {
    this.routes = ApplicationEndpoints;
  }

  public async list(serverId: string): Promise<DatabaseDetails[]> {
    const res = await this.http.get(this.routes.serverDatabases(serverId));
    return res.data;
  }

  public async get(
    serverId: string,
    databaseId: string
  ): Promise<DatabaseDetails> {
    const res = await this.http.get(
      this.routes.serverDatabases(serverId, databaseId)
    );
    return res.data;
  }

  public async create(
    serverId: string,
    body: {
      database: string;
      remote: string;
      host: number;
    }
  ): Promise<DatabaseDetails> {
    const res = await this.http.post(
      this.routes.serverDatabases(serverId),
      body
    );
    return res.data;
  }

  public async delete(serverId: string, databaseId: string): Promise<void> {
    const res = await this.http.delete(
      this.routes.serverDatabases(serverId, databaseId)
    );
    return res.data;
  }
}
