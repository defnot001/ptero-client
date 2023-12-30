import { z } from "zod";

export const NestDetailsResponseSchema = z.object({
  object: z.literal("nest"),
  attributes: z.object({
    id: z.number(),
    uuid: z.string(),
    author: z.string(),
    name: z.string(),
    description: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
  }),
});

export type NestDetailsResponse = z.infer<typeof NestDetailsResponseSchema>;

export type NestDetails = NestDetailsResponse["attributes"];
