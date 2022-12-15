import { z } from 'zod';

const backupAttributes = z.object({
  uuid: z.string(),
  is_successful: z.boolean(),
  is_locked: z.boolean(),
  name: z.string(),
  ignored_files: z.array(z.string()),
  checksum: z.string().nullable(),
  bytes: z.number(),
  created_at: z.string().datetime({ offset: true }),
  completed_at: z.string().datetime({ offset: true }).nullable(),
});

export const BackupCreateResponseSchema = z.object({
  object: z.literal('backup'),
  attributes: backupAttributes,
});

export type BackupCreateResponse = z.infer<typeof BackupCreateResponseSchema>;
