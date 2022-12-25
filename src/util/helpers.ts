import type { ZodTypeAny } from 'zod';
import { ValidationError } from '../classes/ErrorManager';
import type {
  BackupAttributes,
  PterodactylBackup,
} from '../validation/BackupSchema';

export const validateResponse = <T extends ZodTypeAny, R>(
  schema: T,
  data: R,
): R | never => {
  const validated = schema.safeParse(data);

  if (!validated.success) throw new ValidationError();

  return validated.data;
};

/**
 * Function that transforms the backup attributes to a more readable format.
 * @param backup The backup attributes.
 * @returns {PterodactylBackup} The transformed backup object with the type `PterodactylBackup`.
 */
export const transformBackup = (
  backup: BackupAttributes,
): PterodactylBackup => {
  return {
    ...backup,
    created_at: new Date(backup.created_at),
    completed_at: backup.completed_at ? new Date(backup.completed_at) : null,
  };
};
