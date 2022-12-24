import type { ZodTypeAny } from 'zod';
import { ValidationError } from '../classes/ErrorManager';

export const validateResponse = <T extends ZodTypeAny, R>(
  schema: T,
  data: R,
): R | never => {
  const validated = schema.safeParse(data);

  if (!validated.success) throw new ValidationError();

  return validated.data;
};
