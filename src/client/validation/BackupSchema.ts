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

export const PterodactylBackup = z.object({
  object: z.literal('backup'),
  attributes: BackupAttributes,
});

export const BackupDownloadSchema = z.object({
  object: z.literal('signed_url'),
  attributes: z.object({
    url: z.string().url(),
  }),
});

export type PterodactylBackup = z.infer<typeof PterodactylBackup>;
export type BackupListResponse = z.infer<typeof BackupListResponseSchema>;
export type BackupDownloadResponse = z.infer<typeof BackupDownloadSchema>;

/*
{
  object: 'signed_url',
  attributes: {
    url: 'https://panel.cloudtechmc.com:8080/download/backup?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjdmMGJmZTc1ZTc3ZDk0MzhhODlhMGJlNmIxZTA5NjhhIn0.eyJpc3MiOiJodHRwczovL3BhbmVsLmNsb3VkdGVjaG1jLmNvbSIsImF1ZCI6WyJodHRwczovL3BhbmVsLmNsb3VkdGVjaG1jLmNvbTo4MDgwIl0sImp0aSI6IjdmMGJmZTc1ZTc3ZDk0MzhhODlhMGJlNmIxZTA5NjhhIiwiaWF0IjoxNjcxMTc5OTcxLCJuYmYiOjE2NzExNzk2NzEsImV4cCI6MTY3MTE4MDg3MSwiYmFja3VwX3V1aWQiOiJhNGUyMWZjMy0zNWM0LTQ3MjEtYmQ5Yy03ZTVhYTNkNTU5N2EiLCJzZXJ2ZXJfdXVpZCI6ImZlNTY0YzlhLWRhZGUtNDczZC05YmNmLWYyMTA2Mzg3ZGY0NyIsInVzZXJfdXVpZCI6ImQ5M2NjMmVkLTJkYTAtNDgyZi04NmNkLTI1NGNjMGUyY2M4NSIsInVzZXJfaWQiOjQwLCJ1bmlxdWVfaWQiOiJQSmpaTE02T21ZZGN0ZXZkIn0.hRpdCMr-Bmq9uqDQOQ4Zeo_8i8RVua6nb7N42yt9RPM'
  }
}
*/
