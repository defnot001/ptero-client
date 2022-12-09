import type { PteroBackupCreateResponseData } from '../types/interfaces';

export function assertsPteroBackupCreateResponseData(
  data: unknown,
): asserts data is PteroBackupCreateResponseData {
  if (
    typeof data === 'object' &&
    data !== null &&
    'object' in data &&
    data.object === 'backup'
  )
    return;

  throw new Error();
}
