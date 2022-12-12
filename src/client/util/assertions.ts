import type {
  AccountDetailsResponseData,
  BackupCreateResponseData,
  BackupListResponseData,
  ListServersResponseData,
} from '../types/interfaces';

export function assertsBackupCreateResponseData(
  data: unknown,
): asserts data is BackupCreateResponseData {
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

export function assertsBackupListResponseData(
  data: unknown,
): asserts data is BackupListResponseData {
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

export function assertsAccountDetailsResponseData(
  data: unknown,
): asserts data is AccountDetailsResponseData {
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

export function assertsListServersResponseData(
  data: unknown,
): asserts data is ListServersResponseData {
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
