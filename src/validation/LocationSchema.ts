import { z } from "zod";

export const LocationDetailsResponseSchema = z.object({
  object: z.literal("location"),
  attributes: z.object({
    id: z.number(),
    short: z.string(),
    long: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
  }),
});

export type LocationDetailsResponse = z.infer<
  typeof LocationDetailsResponseSchema
>;

export type LocationDetails = LocationDetailsResponse["attributes"];
