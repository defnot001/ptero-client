import type {
  PteroBackupCreateResponseData,
  PteroBackupListResponseData,
} from '../types/interfaces';

export function assertsPteroBackupCreateResponseData(
  data: unknown,
): asserts data is PteroBackupCreateResponseData {
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

export function assertsPteroBackupListResponseData(
  data: unknown,
): asserts data is PteroBackupListResponseData {
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
