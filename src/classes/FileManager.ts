import type { AxiosInstance } from 'axios';
import type { RenameOptions } from '../types/interfaces';
import { ClientEndpoints, replaceVariables } from '../util/endpoints';
import { handleError } from '../util/handleErrors';
import { validateResponse } from '../util/helpers';
import {
  DownloadFileResponse,
  DownloadFileResponseSchema,
  ListFilesResponse,
  ListFilesResponseSchema,
  PterodactylFile,
  PterodactylFileSchema,
} from '../validation/FileSchema';
import { ValidationError } from './ErrorManager';

/**
 * A class that manages files on a pterodactyl server. As a user of this library, you don't need to instantiate this class yourself. It is already instantiated in the `PteroClient` class.\
 * \
 * The FileManager takes in an `AxiosInstance` as a constructor parameter. This is the `http` instance of the `PteroClient` class.
 */
export default class FileManager {
  public constructor(private http: AxiosInstance) {}
  /**
   * An `async` method that resolves to an array of all the files in a directory on a server.
   * The promise will reject if the request fails.
   * @param {string} serverID The ID of the server.
   * @param {string} directory The directory to list files from. Defaults to the root directory.
   *
   * Make sure to `await` the method call and handle potential **errors**.
   * ```ts
   * const files: PterodactylFile[] = await client.files.list('fe564c9a', '/mods');
   * console.log(files[0]);
   * // logs the first file in the list to the console.
   * ```
   */
  public async list(
    serverID: string,
    directory = '/',
  ): Promise<PterodactylFile[]> {
    const encoded = encodeURIComponent(directory);
    const url =
      replaceVariables(ClientEndpoints.listFiles, { serverID }) + encoded;

    try {
      const { data } = await this.http.get<ListFilesResponse>(url);

      const validated = validateResponse(ListFilesResponseSchema, data);

      return validated.data.map((file) => file.attributes);
    } catch (err) {
      return handleError(
        err,
        `Failed to list items for ${serverID} in ${directory}!`,
      );
    }
  }

  /**
   * An `async` method that resolves to the content of a file.
   * The promise will reject if the request fails.
   * @param {string} serverID The ID of the server.
   * @param {string} filePath The path of the file.
   *
   * Make sure to `await` the method call and handle potential **errors**.
   * ```ts
   * const content: unknown = await client.files.getContent('fe564c9a', '/eula.txt');
   * ```
   */
  public async getContent(
    serverID: string,
    filePath: string,
  ): Promise<unknown> {
    if (!filePath.startsWith('/')) filePath = `/${filePath}`;

    const encoded = encodeURIComponent(filePath);

    const url =
      replaceVariables(ClientEndpoints.getFileContents, { serverID }) + encoded;

    try {
      const { data } = await this.http.get<unknown>(url);

      return data;
    } catch (err) {
      return handleError(err, `Failed to get content of ${filePath}!`);
    }
  }

  /**
   * An `async` method that resolves to an url that can be used to download a file from a pterodactyl server.
   * The promise will reject if the request fails.
   * @param {string} serverID The ID of the server.
   * @param {string} filePath The path of the file.
   *
   * Make sure to `await` the method call and handle potential **errors**.
   * ```ts
   * const url: string = await client.files.getDownloadLink('fe564c9a', '/eula.txt');
   * ```
   */
  public async getDownloadLink(
    serverID: string,
    filePath: string,
  ): Promise<string> {
    if (!filePath.startsWith('/')) filePath = `/${filePath}`;

    const encoded = encodeURIComponent(filePath);

    const url =
      replaceVariables(ClientEndpoints.downloadFile, { serverID }) + encoded;

    try {
      const { data } = await this.http.get<DownloadFileResponse>(url);

      const validated = validateResponse(DownloadFileResponseSchema, data);

      return validated.attributes.url;
    } catch (err) {
      return handleError(err, `Failed to get content of ${filePath}!`);
    }
  }

  /**
   * An `async` method that renames a file or directory on a server.
   * The promise will reject if the request fails.
   * @param {string} serverID The ID of the server.
   * @param {RenameOptions} options The options for renaming the file.
   *
   * Make sure to `await` the method call and handle potential **errors**.
   * ```ts
   * await client.files.rename('fe564c9a', { from: 'eula.txt', to: 'eula2.txt', directory: '/mods' });
   * ```
   */
  public async rename(serverID: string, options: RenameOptions): Promise<void> {
    const { from, to } = options;
    let directory = options.directory || '/';

    if (!directory.startsWith('/')) directory = `/${directory}`;
    if (!directory.endsWith('/')) directory = `${directory}/`;

    const url = replaceVariables(ClientEndpoints.renameFile, { serverID });

    const obj = {
      root: directory,
      files: [{ from: from, to: to }],
    };

    try {
      await this.http.put(url, obj);

      return;
    } catch (err) {
      return handleError(err, `Failed to rename ${directory + from}!`);
    }
  }

  /**
   * An `async` method that copies a file or directory on a server.
   * The promise will reject if the request fails.
   * @param {string} serverID The ID of the server.
   * @param {string} filePath The path of the file to copy.
   *
   * Make sure to `await` the method call and handle potential **errors**.
   * ```ts
   * await client.files.copy('fe564c9a', '/eula.txt');
   * ```
   */
  public async copy(serverID: string, filePath: string): Promise<void> {
    if (!filePath.startsWith('/')) filePath = `/${filePath}`;

    const url = replaceVariables(ClientEndpoints.copyFile, { serverID });

    try {
      await this.http.post(url, { location: filePath });

      return;
    } catch (err) {
      return handleError(err, `Failed to copy ${filePath}!`);
    }
  }

  /**
   * An `async` method that writes content to a file on a server.
   * The promise will reject if the request fails.
   * @param {string} serverID The ID of the server.
   * @param {string} filePath The path of the file to write to.
   * @param {string} content The content to write to the file.
   *
   * Make sure to `await` the method call and handle potential **errors**.
   * ```ts
   * await client.files.write('fe564c9a', 'Hello World!', '/eula.txt');
   * ```
   */
  public async write(
    serverID: string,
    filePath: string,
    content: string,
  ): Promise<void> {
    if (!filePath.startsWith('/')) filePath = `/${filePath}`;

    const encoded = encodeURIComponent(filePath);

    const url =
      replaceVariables(ClientEndpoints.writeFile, { serverID }) + encoded;

    try {
      await this.http.post(url, content);

      return;
    } catch (err) {
      return handleError(err, `Failed to write to ${filePath}!`);
    }
  }

  /**
   * An `async` method that compresses a file or directory on a server and resolves an object containing information about the compressed file.
   * The promise will reject if the request fails.
   * @param {string} serverID The ID of the server.
   * @param {string} fileName The name of the file to compress.
   * @param {string} [directory='/'] The directory of the file to compress. Defaults to `/`.
   *
   * Make sure to `await` the method call and handle potential **errors**.
   * ```ts
   * const file: PterodactylFile = await client.files.compress('fe564c9a', '/mods');
   * ```
   */
  public async compress(
    serverID: string,
    fileName: string,
    directory = '/',
  ): Promise<PterodactylFile> {
    if (!directory.startsWith('/')) directory = `/${directory}`;
    if (!directory.endsWith('/')) directory = `${directory}/`;

    const obj = {
      root: directory,
      files: [fileName],
    };

    const url = replaceVariables(ClientEndpoints.compressFile, { serverID });

    try {
      const { data } = await this.http.post(url, obj);

      const validated = PterodactylFileSchema.safeParse(data);

      if (!validated.success) throw new ValidationError();

      return validated.data.attributes;
    } catch (err) {
      return handleError(err, `Failed to compress ${fileName + directory}!`);
    }
  }

  /**
   * An `async` method that decompresses a file or directory on a server.
   * The promise will reject if the request fails.
   * @param {string} serverID The ID of the server.
   * @param {string} fileName The name of the file to decompress.
   * @param {string} [directory='/'] The directory of the file to decompress. Defaults to `/`.
   *
   * Make sure to `await` the method call and handle potential **errors**.
   * ```ts
   * await client.files.decompress('fe564c9a', '/mods.tar.gz');
   * ```
   */
  public async decompress(
    serverID: string,
    fileName: string,
    directory = '/',
  ): Promise<void> {
    if (!directory.startsWith('/')) directory = `/${directory}`;
    if (!directory.endsWith('/')) directory = `${directory}/`;

    const obj = {
      root: directory,
      file: fileName,
    };

    const url = replaceVariables(ClientEndpoints.decompressFile, { serverID });

    try {
      await this.http.post(url, obj);

      return;
    } catch (err) {
      return handleError(err, `Failed to decompress ${fileName + directory}!`);
    }
  }

  /**
   * An `async` method that deletes a file or directory on a server.
   * The promise will reject if the request fails.
   * @param {string} serverID The ID of the server.
   * @param {string[]} fileNames The names of the files to delete.
   * @param {string} [directory='/'] The directory of the files to delete. Defaults to `/`.
   *
   * Make sure to `await` the method call and handle potential **errors**.
   * ```ts
   * await client.files.delete('fe564c9a', ['eula.txt', 'mods.tar.gz']);
   * ```
   */
  public async delete(
    serverID: string,
    fileNames: string[],
    directory = '/',
  ): Promise<void> {
    if (!directory.startsWith('/')) directory = `/${directory}`;
    if (!directory.endsWith('/')) directory = `${directory}/`;

    const obj = {
      root: directory,
      files: [...fileNames],
    };

    const url = replaceVariables(ClientEndpoints.deleteFile, { serverID });

    try {
      await this.http.post(url, obj);

      return;
    } catch (err) {
      return handleError(err, `Failed to delete ${fileNames}!`);
    }
  }

  /**
   * An `async` method that creates a directory on a server.
   * The promise will reject if the request fails.
   * @param {string} serverID The ID of the server.
   * @param {string} directoryName The name of the directory to create.
   * @param {string} [directory='/'] The directory to create the directory in. Defaults to `/`.
   *
   * Make sure to `await` the method call and handle potential **errors**.
   * ```ts
   * await client.files.createDirectory('fe564c9a', 'testDirectory', '/world');
   * ```
   */
  public async createDirectory(
    serverID: string,
    directoryName: string,
    directory = '/',
  ): Promise<void> {
    if (!directory.startsWith('/')) directory = `/${directory}`;
    if (!directory.endsWith('/')) directory = `${directory}/`;

    const obj = {
      root: directory,
      name: directoryName,
    };

    const url = replaceVariables(ClientEndpoints.createDirectory, { serverID });

    try {
      await this.http.post(url, obj);

      return;
    } catch (err) {
      return handleError(err, `Failed to create directory ${directoryName}!`);
    }
  }
}
