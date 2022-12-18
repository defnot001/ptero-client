import { z } from 'zod';

export const PterodactylFileSchema = z.object({
  object: z.literal('file_object'),
  attributes: z.object({
    name: z.string(),
    mode: z.string(),
    mode_bits: z.string(),
    size: z.number(),
    is_file: z.boolean(),
    is_symlink: z.boolean(),
    mimetype: z.string(),
    created_at: z.string().datetime({ offset: true }),
    modified_at: z.string().datetime({ offset: true }),
  }),
});

export const ListFilesResponseSchema = z.object({
  object: z.literal('list'),
  data: z.array(PterodactylFileSchema),
});

export const DownloadFileResponseSchema = z.object({
  object: z.literal('signed_url'),
  attributes: z.object({
    url: z.string().url(),
  }),
});

export type ListFilesResponse = z.infer<typeof ListFilesResponseSchema>;
export type PterodactylFile = z.infer<typeof PterodactylFileSchema>;
export type DownloadFileResponse = z.infer<typeof DownloadFileResponseSchema>;

/*
{
  object: 'signed_url',
  attributes: {
    url: 'https://panel.cloudtechmc.com:8080/download/file?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjhlNTI4MzVlNGYxNTlhNDVhNzQ4ODM5NmY0ZDdiNTZhIn0.eyJpc3MiOiJodHRwczovL3BhbmVsLmNsb3VkdGVjaG1jLmNvbSIsImF1ZCI6WyJodHRwczovL3BhbmVsLmNsb3VkdGVjaG1jLmNvbTo4MDgwIl0sImp0aSI6IjhlNTI4MzVlNGYxNTlhNDVhNzQ4ODM5NmY0ZDdiNTZhIiwiaWF0IjoxNjcxMzE3NDg4LCJuYmYiOjE2NzEzMTcxODgsImV4cCI6MTY3MTMxODM4OCwiZmlsZV9wYXRoIjoiL3dvcmxkL2NhcnBldC5jb25mIiwic2VydmVyX3V1aWQiOiJmYmI5Nzg0Yi0wMDBkLTQ1YWMtOGZjNC1lN2Y3Y2JiZGI2YjEiLCJ1c2VyX3V1aWQiOiJkOTNjYzJlZC0yZGEwLTQ4MmYtODZjZC0yNTRjYzBlMmNjODUiLCJ1c2VyX2lkIjo0MCwidW5pcXVlX2lkIjoiNGpEZ0RXOEwyY1ZMNnhYbCJ9.JxJFhFju1OkpXYS6inwA0SYWOP_TyGExlAw3t7fOWE0'
  }
}
*/
