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

export const BackupResponseSchema = z.object({
  object: z.literal('backup'),
  attributes: BackupAttributes,
});

export const BackupDownloadSchema = z.object({
  object: z.literal('signed_url'),
  attributes: z.object({
    url: z.string().url(),
  }),
});

export type BackupAttributes = z.infer<typeof BackupAttributes>;
export type BackupResponse = z.infer<typeof BackupResponseSchema>;
export type BackupListResponse = z.infer<typeof BackupListResponseSchema>;
export type BackupDownloadResponse = z.infer<typeof BackupDownloadSchema>;

export type PterodactylBackup = {
  uuid: string;
  is_successful: boolean;
  is_locked: boolean;
  name: string;
  ignored_files: string[];
  checksum: string | null;
  bytes: number;
  created_at: Date;
  completed_at: Date | null;
};

export type PterodactylBackupListMeta = {
  backup_count: number;
  pagination: {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    links: Record<string, unknown>;
  };
};
