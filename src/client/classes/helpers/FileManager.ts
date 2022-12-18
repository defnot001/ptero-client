import axios from 'axios';
import type { AuthDetails, RenameOptions } from '../../types/interfaces';
import { ClientEndpoints } from '../../util/clientEndpoints';
import { handleError } from '../../util/handleErrors';
import { getRequestHeaders, getRequestURL } from '../../util/requests';
import {
  DownloadFileResponseSchema,
  ListFilesResponseSchema,
  PterodactylFile,
  PterodactylFileSchema,
} from '../../validation/FileSchema';
import { ValidationError } from '../errors/Errors';

export default class FileManager {
  private readonly baseURL: string;
  private readonly apiKey: string;

  constructor(authDetails: AuthDetails) {
    this.baseURL = authDetails.hostURL;
    this.apiKey = authDetails.apiKey;
  }

  /**
   * Lists the files of a server.
   * @async @public @method list
   * @param {string} serverID The ID of the server.
   * @param {string} [directory='/'] The directory to list.
   * @returns {Promise<ListFilesResponse>} The list of files.
   * @throws {APIValidationError} If the response is different than expected.
   * @throws {PterodactylError} If the request failed due to an error on the server.
   * @throws {Error} If the request failed.
   */
  public async list(serverID: string, directory = '/') {
    const encoded = encodeURIComponent(directory);

    try {
      const { data } = await axios.get(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.listFiles,
          serverID: serverID,
        }) + encoded,
        getRequestHeaders(this.apiKey),
      );

      const validated = ListFilesResponseSchema.safeParse(data);

      if (!validated.success) throw new ValidationError();

      return validated.data;
    } catch (err) {
      return handleError(
        err,
        `Failed to list items for ${serverID} in ${directory}!`,
      );
    }
  }

  /**
   * Gets the content of a file.
   * @async @public @method getContent
   * @param {string} serverID The ID of the server.
   * @param {string} filePath The path of the file.
   * @returns {Promise<unknown>} The content of the file.
   * @throws {PterodactylError} If the request failed due to an error on the server.
   * @throws {Error} If the request failed.
   * @example const content = await client.files.getContent('fbb9784b', 'world/carpet.conf');
   */
  public async getContent(serverID: string, filePath: string) {
    if (!filePath.startsWith('/')) filePath = `/${filePath}`;

    const encoded = encodeURIComponent(filePath);

    try {
      const { data } = await axios.get(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.getFileContents,
          serverID: serverID,
        }) + encoded,
        getRequestHeaders(this.apiKey),
      );

      return data as unknown;
    } catch (err) {
      return handleError(err, `Failed to get content of ${filePath}!`);
    }
  }

  /**
   * Generates a downlaod link to a specified file.
   * @async @public @method download
   * @param {string} serverID The ID of the server.
   * @param {string} filePath The path of the file.
   * @returns {Promise<DownloadFileResponse>} The content of the file.
   * @throws {APIValidationError} If the response is different than expected.
   * @throws {PterodactylError} If the request failed due to an error on the server.
   * @throws {Error} If the request failed.
   */
  public async download(serverID: string, filePath: string) {
    if (!filePath.startsWith('/')) filePath = `/${filePath}`;

    const encoded = encodeURIComponent(filePath);

    try {
      const { data } = await axios.get(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.downloadFile,
          serverID: serverID,
        }) + encoded,
        getRequestHeaders(this.apiKey),
      );

      const validated = DownloadFileResponseSchema.safeParse(data);

      if (!validated.success) throw new ValidationError();

      return validated.data;
    } catch (err) {
      return handleError(err, `Failed to get content of ${filePath}!`);
    }
  }

  /**
   * Renames a file or directory in the specified server.
   * @async @public @method rename
   * @param {string} serverID The ID of the server.
   * @param {RenameOptions} options The renaming options.
   * @param {string} options.from The name of the file or directory to rename.
   * @param {string} options.to The new name of the file or directory.
   * @param {string} [options.directory='/'] The directory of the file or directory to rename. Default to the root directory.
   * @returns {Promise<void>} The response from the server.
   * @throws {PterodactylError} If the request failed due to an error on the server.
   * @throws {Error} If the request failed.
   * @example await client.files.rename('fbb9784b', { from: 'server.properties', to: 'server.properties.old' });
   */
  public async rename(serverID: string, options: RenameOptions) {
    const { from, to } = options;
    let directory = options.directory || '/';

    if (!directory.startsWith('/')) directory = `/${directory}`;
    if (!directory.endsWith('/')) directory = `${directory}/`;

    const putObject = {
      root: directory,
      files: [{ from: from, to: to }],
    };

    try {
      await axios.put(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.renameFile,
          serverID: serverID,
        }),
        putObject,
        getRequestHeaders(this.apiKey),
      );

      return;
    } catch (err) {
      return handleError(err, `Failed to rename ${directory + from}!`);
    }
  }

  /**
   * Duplicate a file or directory in the specified server.
   * @async @public @method copy
   * @param {string} serverID The ID of the server.
   * @param {string} filePath The path of the file or directory to duplicate.
   * @returns {Promise<void>} The response from the server.
   * @throws {PterodactylError} If the request failed due to an error on the server.
   * @throws {Error} If the request failed.
   * @example await client.files.copy('fbb9784b', 'server.properties');
   */
  public async copy(serverID: string, filePath: string) {
    if (!filePath.startsWith('/')) filePath = `/${filePath})`;

    try {
      await axios.post(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.copyFile,
          serverID: serverID,
        }),
        { location: filePath },
        getRequestHeaders(this.apiKey),
      );

      return;
    } catch (err) {
      return handleError(err, `Failed to copy ${filePath}!`);
    }
  }

  /**
   * Writes content to a specified file.
   * @async @public @method write
   * @param {string} serverID The ID of the server.
   * @param {string} content The content to write.
   * @param {string} [filePath='/'] The path of the file to write to. Defaults to the root directory.
   * @returns {Promise<void>} The response from the server.
   * @throws {PterodactylError} If the request failed due to an error on the server.
   * @throws {Error} If the request failed.
   * @example await client.files.write('fbb9784b', 'Hello World!', 'test.txt');
   */
  public async write(serverID: string, content: string, filePath = '/') {
    if (!filePath.startsWith('/')) filePath = `/${filePath}`;

    const encoded = encodeURIComponent(filePath);

    try {
      await axios.post(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.writeFile,
          serverID: serverID,
        }) + encoded,
        content,
        getRequestHeaders(this.apiKey),
      );

      return;
    } catch (err) {
      return handleError(err, `Failed to write to ${filePath}!`);
    }
  }

  /**
   * Compresses a file or directory in the specified server.
   * @async @public @method compress
   * @param {string} serverID The ID of the server.
   * @param {string} fileName The name of the file or directory to compress.
   * @param {string} [directory='/'] The directory of the file or directory to compress. Defaults to the root directory.
   * @returns {Promise<void>} The response from the server.
   * @throws {PterodactylError} If the request failed due to an error on the server.
   * @throws {Error} If the request failed.
   * @example await client.files.compress('fbb9784b', '/mods');
   */
  public async compress(
    serverID: string,
    fileName: string,
    directory = '/',
  ): Promise<PterodactylFile> {
    if (!directory.startsWith('/')) directory = `/${directory}`;
    if (!directory.endsWith('/')) directory = `${directory}/`;

    const object = {
      root: directory,
      files: [fileName],
    };

    try {
      const { data } = await axios.post(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.compressFile,
          serverID: serverID,
        }),
        object,
        getRequestHeaders(this.apiKey),
      );

      const validated = PterodactylFileSchema.safeParse(data);

      if (!validated.success) throw new ValidationError();

      return validated.data;
    } catch (err) {
      return handleError(err, `Failed to compress ${fileName + directory}!`);
    }
  }

  /**
   * Decompresses a file or directory in the specified server. If the file already exists, it will NOT be overwritten.
   * @async @public @method decompress
   * @param {string} serverID The ID of the server.
   * @param {string} fileName The name of the file or directory to decompress.
   * @param {string} [directory='/'] The directory of the file or directory to decompress. Defaults to the root directory.
   * @returns {Promise<void>} The response from the server.
   * @throws {PterodactylError} If the request failed due to an error on the server.
   * @throws {Error} If the request failed.
   * @example await client.files.decompress('fbb9784b', 'test.tar.gz');
   */
  public async decompress(
    serverID: string,
    fileName: string,
    directory = '/',
  ): Promise<void> {
    if (!directory.startsWith('/')) directory = `/${directory}`;
    if (!directory.endsWith('/')) directory = `${directory}/`;

    const object = {
      root: directory,
      file: fileName,
    };

    try {
      await axios.post(
        getRequestURL({
          hostURL: this.baseURL,
          endpoint: ClientEndpoints.decompressFile,
          serverID: serverID,
        }),
        object,
        getRequestHeaders(this.apiKey),
      );

      return;
    } catch (err) {
      return handleError(err, `Failed to decompress ${fileName + directory}!`);
    }
  }
}
