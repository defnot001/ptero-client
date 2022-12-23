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

const PterodactylFileAttributesSchema = PterodactylFileSchema.shape.attributes;

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
export type PterodactylFile = z.infer<typeof PterodactylFileAttributesSchema>;
export type DownloadFileResponse = z.infer<typeof DownloadFileResponseSchema>;
