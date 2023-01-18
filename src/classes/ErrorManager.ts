import type { APIError } from '../types/types';

export class PterodactylError extends Error {
  public override message: string;

  public constructor(error: APIError) {
    const { code, status, detail } = error;
    super(detail);

    this.message = `Status: ${status} (${code}): ${detail}`;
  }
}

export class ValidationError extends Error {
  public override message: string;

  public constructor() {
    super();
    this.message =
      'Received invalid data from the API! Please report this error to the developers!';
  }
}

/**
 * Helper class to provide methods to check errors for specific types. As a user of this library, you don't need to instantiate this class yourself. It is already instantiated in the `PteroClient` class.\
 */
export default class ErrorManager {
  /**
   * Function to check if the unknown error is a PterodactylError. Returns true/false.
   * @param {unknown} error
   *
   * ```ts
   * if (client.errors.isPterodactylError(err)) {
   *  console.error(err.message);
   * }
   * ```
   */
  public isPterodactylError(error: unknown): error is PterodactylError {
    return error instanceof PterodactylError;
  }

  /**
   * Function to check if the unknown error is a ValidationError. Returns true/false.
   * @param {unknown} error
   * ```ts
   * if (client.errors.isValidationError(err)) {
   * console.error(err.message);
   * }
   * ```
   */
  public isValidationError(error: unknown): error is ValidationError {
    return error instanceof ValidationError;
  }
}
