import { PterodactylError, ValidationError } from '../errors/Errors';

export default class ErrorManager {
  /**
   * Checks if the error is a PterodactylError.
   * @public @method isPterodactylError
   * @param  {unknown} error
   * @returns {boolean} Whether the error is a PterodactylError.
   */
  public isPterodactylError(error: unknown): error is PterodactylError {
    return error instanceof PterodactylError;
  }

  /**
   * Checks if the error is a ValidationError.
   * @public @method isValidationError
   * @param  {unknown} error
   * @returns {boolean} Whether the error is a ValidationError.
   */
  public isValidationError(error: unknown): error is ValidationError {
    return error instanceof ValidationError;
  }
}
