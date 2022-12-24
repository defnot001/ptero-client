import type { AxiosInstance } from 'axios';
import type { BackupOptions } from '../types/interfaces';
import { ClientEndpoints, replaceVariables } from '../util/clientEndpoints';
import { handleError } from '../util/handleErrors';
import { validateResponse } from '../util/zodValidation';
import {
  BackupAttributes,
  BackupDownloadResponse,
  BackupDownloadSchema,
  BackupListResponse,
  BackupListResponseSchema,
  BackupResponse,
  BackupResponseSchema,
  PterodactylBackup,
  PterodactylBackupListMeta,
} from '../validation/BackupSchema';

/**
 * A class that manages backups on a pterodactyl server. As a user of this library, you don't need to instantiate this class yourself. It is already instantiated in the `PteroClient` class.\
 * \
 * The BackupManager takes in an `AxiosInstance` as a constructor parameter. This is the `http` instance of the `PteroClient` class.
 */
export default class BackupManager {
  public constructor(private http: AxiosInstance) {}

  /**
   * A private method that transforms the backup attributes to a more readable format.
   * @param backup The backup attributes.
   * @returns {PterodactylBackup} The transformed backup object with the type `PterodactylBackup`.
   */
  private transformBackup(backup: BackupAttributes): PterodactylBackup {
    return {
      ...backup,
      created_at: new Date(backup.created_at),
      completed_at: backup.completed_at ? new Date(backup.completed_at) : null,
    };
  }

  /**
   * An `async` method that resolves to a list of all backups on a pterodactyl server. Additionally it returns the backup meta.
   * The promise will reject if the request fails.
   * @param serverID The ID of the server. It can be found in the URL of the server. (e.g. `https://panel.example.com/admin/servers/fe564c9a`)
   *
   * Make sure to `await` the method call and handle potential **errors**.
   * ```ts
   * const { data, meta } = await client.backups.list('fe564c9a');
   * console.log(data[0]);
   * // logs the first (oldest) backup in the list to the console.
   * console.log(`Current backup count: ${meta.pagination.total}`);
   * // => Current backup count: 3
   *```
   */
  public async list(
    serverID: string,
  ): Promise<{ data: PterodactylBackup[]; meta: PterodactylBackupListMeta }> {
    const url = replaceVariables(ClientEndpoints.listBackups, { serverID });
    try {
      const { data } = await this.http.get<BackupListResponse>(url);

      const validated = validateResponse(BackupListResponseSchema, data);

      const backupList: PterodactylBackup[] = validated.data.map((backup) =>
        this.transformBackup(backup.attributes),
      );

      return { data: backupList, meta: validated.meta };
    } catch (err) {
      return handleError(err, `Failed to list backups for ${serverID}!`);
    }
  }

  /**
   * An `async` method that creates a backup on a pterodactyl server and resolves to an object with the backup details.
   * The promise will reject if the request fails.
   * @param serverID The ID of the server. It can be found in the URL of the server. (e.g. `https://panel.example.com/admin/servers/fe564c9a`)
   * @param options The options for the backup. You can specify a custom name for the backup and whether it should be locked. If you don't pass any options, the backup will be named `Backup at <current date> with ptero-client.` and it will not be locked.
   *
   * Make sure to `await` the method call and handle potential **errors**.
   * ```ts
   * const backup: PterodactylBackup = await client.backups.create('fe564c9a', {
   *    backupName: 'My custom backup name',
   *    locked: true,
   * });
   * ```
   */
  public async create(
    serverID: string,
    options?: BackupOptions,
  ): Promise<PterodactylBackup> {
    try {
      const backupName =
        options?.backupName || `Backup at ${new Date()} with ptero-client.`;

      const locked = options?.locked || false;

      const url = replaceVariables(ClientEndpoints.createBackup, { serverID });

      const { data } = await this.http.post<BackupResponse>(url, {
        name: backupName,
        is_locked: locked,
      });

      const { attributes } = validateResponse(BackupResponseSchema, data);

      return this.transformBackup(attributes);
    } catch (err) {
      return handleError(err, `Failed to create backup of server ${serverID}!`);
    }
  }

  /**
   * An `async` method that resolves to the details of a specific backups on a pterodactyl server.
   * The promise will reject if the request fails.
   * @param serverID The ID of the server. It can be found in the URL of the server. (e.g. `https://panel.example.com/admin/servers/fe564c9a`)
   * @param backupID The ID of the backup. It can be found by using the `list()` method of the `BackupManager` class.
   *
   * Make sure to `await` the method call and handle potential **errors**.
   * ```ts
   * const backup: PterodactylBackup = await client.backups.getDetails('fe564c9a', '1ca291a8-e606-4f7d-b7c7-af183ae9d142');
   * ```
   */
  public async getDetails(
    serverID: string,
    backupID: string,
  ): Promise<PterodactylBackup> {
    const url = replaceVariables(ClientEndpoints.backupDetails, {
      serverID,
      backupID,
    });

    try {
      const { data } = await this.http.get<BackupResponse>(url);
      const { attributes } = validateResponse(BackupResponseSchema, data);

      return this.transformBackup(attributes);
    } catch (err) {
      return handleError(
        err,
        `Cannot get details for ${backupID} of server: ${serverID}!`,
      );
    }
  }

  /**
   * An `async` method that resolves a download url of a specific backups on a pterodactyl server.
   * The promise will reject if the request fails.
   * @param serverID The ID of the server. It can be found in the URL of the server. (e.g. `https://panel.example.com/admin/servers/fe564c9a`)
   * @param backupID The ID of the backup. It can be found by using the `list()` or the getDetails() method of the `BackupManager` class.
   *
   * Make sure to `await` the method call and handle potential **errors**.
   * ```ts
   * const url: string = await client.backups.getDownloadLink('fe564c9a', '1ca291a8-e606-4f7d-b7c7-af183ae9d142');
   * ```
   */
  public async getDownloadLink(
    serverID: string,
    backupID: string,
  ): Promise<string> {
    const url = replaceVariables(ClientEndpoints.downloadBackup, {
      serverID,
      backupID,
    });

    try {
      const { data } = await this.http.get<BackupDownloadResponse>(url);
      const { attributes } = validateResponse(BackupDownloadSchema, data);

      return attributes.url;
    } catch (err) {
      return handleError(
        err,
        `Cannot get a download link for ${backupID} of server: ${serverID}!`,
      );
    }
  }

  /**
   * An `async` method that deletes a specific backups on a pterodactyl server.
   * The promise will reject if the request fails.
   * @param serverID The ID of the server. It can be found in the URL of the server. (e.g. `https://panel.example.com/admin/servers/fe564c9a`)
   * @param backupID The ID of the backup. It can be found by using the `list()` or the getDetails() method of the `BackupManager` class.
   *
   * Make sure to `await` the method call and handle potential **errors**.
   * ```ts
   * await client.backups.delete('fe564c9a', '1ca291a8-e606-4f7d-b7c7-af183ae9d142');
   * ```
   */
  public async delete(serverID: string, backupID: string): Promise<void> {
    const url = replaceVariables(ClientEndpoints.deleteBackup, {
      serverID,
      backupID,
    });

    try {
      await this.http.delete(url);
      return;
    } catch (err) {
      return handleError(
        err,
        `Cannot delete ${backupID} from server: ${serverID}!`,
      );
    }
  }
}
