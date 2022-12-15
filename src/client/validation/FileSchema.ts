import { z } from 'zod';

export const PterodactylFile = z.object({
  object: z.literal('file_object'),
  attributes: z.object({
    name: z.string(),
    mode: z.string(),
    mode_bits: z.string(),
    size: z.number(),
    is_file: z.boolean(),
    is_symlink: z.boolean(),
    mimetype: z.string(),
    created_at: z.string(),
    modified_at: z.string(),
  }),
});

export const ListFilesResponseSchema = z.object({
  object: z.literal('list'),
  data: z.array(PterodactylFile),
});

export type ListFilesResponse = z.infer<typeof ListFilesResponseSchema>;
export type PterodactylFile = z.infer<typeof PterodactylFile>;
