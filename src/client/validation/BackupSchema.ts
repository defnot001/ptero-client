import { z } from 'zod';

const BackupAttributes = z.object({
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

const BackupListMeta = z.object({
  backup_count: z.number(),
  pagination: z.object({
    total: z.number(),
    count: z.number(),
    per_page: z.number(),
    current_page: z.number(),
    total_pages: z.number(),
    links: z.record(z.unknown()),
  }),
});

const BackupListData = z.object({
  object: z.literal('backup'),
  attributes: BackupAttributes,
});

export const BackupListResponseSchema = z.object({
  object: z.literal('list'),
  data: z.array(BackupListData),
  meta: BackupListMeta,
});

export const BackupCreateResponseSchema = z.object({
  object: z.literal('backup'),
  attributes: BackupAttributes,
});

export type BackupCreateResponse = z.infer<typeof BackupCreateResponseSchema>;
export type BackupListResponse = z.infer<typeof BackupListResponseSchema>;
