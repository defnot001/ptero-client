import axios, { AxiosError } from 'axios';
import { PterodactylError, ValidationError } from '../classes/errors/Errors';
import type { APIError } from '../types/interfaces';

const getAPIErrors = (err: AxiosError): APIError[] | undefined => {
  if (
    typeof err === 'object' &&
    err !== undefined &&
    'response' in err &&
    typeof err.response === 'object' &&
    err.response &&
    'data' in err.response &&
    typeof err.response.data === 'object' &&
    err.response.data &&
    'errors' in err.response.data &&
    Array.isArray(err.response.data.errors) &&
    err.response.data.errors.every((error) => isAPIError(error))
  ) {
    return err.response.data.errors as APIError[];
  }

  return;
};

const isValidationError = (err: unknown): err is ValidationError => {
  return err instanceof ValidationError;
};

const isAPIError = (err: unknown): err is APIError => {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    'status' in err &&
    'detail' in err
  );
};

export const handleError = (error: unknown, message: string): never => {
  if (isValidationError(error)) throw error;

  if (axios.isAxiosError(error)) {
    const apiErrors = getAPIErrors(error);

    if (apiErrors && apiErrors[0]) {
      throw new PterodactylError(apiErrors[0]);
    } else {
      throw new Error(message);
    }
  }

  throw new Error(message);
};
