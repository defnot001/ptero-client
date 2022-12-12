import type {
  AccountDetailsResponse,
  BackupCreateResponse,
  BackupListResponse,
  ListFilesResponse,
  ListServersResponse,
} from '../types/interfaces';

export function assertsBackupCreateResponse(
  data: unknown,
): asserts data is BackupCreateResponse {
  if (
    typeof data === 'object' &&
    data !== null &&
    'object' in data &&
    data.object === 'backup'
  ) {
    return;
  }

  throw new Error();
}

export function assertsBackupListResponse(
  data: unknown,
): asserts data is BackupListResponse {
  if (
    typeof data === 'object' &&
    data !== null &&
    'object' in data &&
    data.object === 'list'
  ) {
    return;
  }

  throw new Error();
}

export function assertsAccountDetailsResponse(
  data: unknown,
): asserts data is AccountDetailsResponse {
  if (
    typeof data === 'object' &&
    data !== null &&
    'object' in data &&
    data.object === 'user' &&
    'attributes' in data &&
    typeof data.attributes === 'object' &&
    data.attributes !== null
  ) {
    return;
  }

  throw new Error();
}

export function assertsListServersResponse(
  data: unknown,
): asserts data is ListServersResponse {
  if (
    typeof data === 'object' &&
    data !== null &&
    'object' in data &&
    data.object === 'list' &&
    'data' in data &&
    Array.isArray(data.data) &&
    data.data.every(
      (server) =>
        typeof server === 'object' &&
        server !== null &&
        'object' in server &&
        server.object === 'server',
    )
  ) {
    return;
  }

  throw new Error();
}

export function assertsListFilesResponse(
  data: unknown,
): asserts data is ListFilesResponse {
  if (
    typeof data === 'object' &&
    data !== null &&
    'object' in data &&
    data.object === 'list' &&
    'data' in data &&
    Array.isArray(data.data) &&
    data.data.every(
      (file) =>
        typeof file === 'object' &&
        file !== null &&
        'object' in file &&
        file.object === 'file_object',
    )
  ) {
    return;
  }

  throw new Error();
}
