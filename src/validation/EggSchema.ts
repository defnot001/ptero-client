import { z } from "zod";

export const EggDetailsResponseSchema = z.object({
  object: z.literal("egg"),
  attributes: z.object({
    id: z.number(),
    uuid: z.string(),
    name: z.string(),
    nest: z.number(),
    author: z.string(),
    description: z.string(),
    docker_image: z.string(),
    config: z.object({
      files: z.any(),
      startup: z.any(),
      stop: z.any(),
      logs: z.object({
        custom: z.boolean(),
        location: z.string(),
      }),
      extends: z.any(),
    }),
    startup: z.string(),
    script: z.any(),
    created_at: z.string(),
    updated_at: z.string(),
  }),
});

export type EggDetailsResponse = z.infer<typeof EggDetailsResponseSchema>;

export type EggDetails = EggDetailsResponse["attributes"];
