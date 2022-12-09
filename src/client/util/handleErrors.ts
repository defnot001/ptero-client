import axios, { AxiosError } from 'axios';
import type { PteroAPIError } from '../types/interfaces';

const getAPIErrors = (err: AxiosError): PteroAPIError[] | undefined => {
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
    err.response.data.errors.every((error) => isPteroAPIError(error))
  ) {
    return err.response.data.errors as PteroAPIError[];
  }

  return;
};

export const isPteroAPIError = (err: unknown): err is PteroAPIError => {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    'status' in err &&
    'detail' in err
  );
};

export const getError = (error: unknown): PteroAPIError | undefined => {
  if (!axios.isAxiosError(error)) return;

  const apiErrors = getAPIErrors(error);

  if (!apiErrors || !apiErrors[0]) return;

  return apiErrors[0];
};
