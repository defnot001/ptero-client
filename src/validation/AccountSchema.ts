import { z } from 'zod';

export const AccountDetailsResponseSchema = z.object({
  object: z.literal('user'),
  attributes: z.object({
    id: z.number(),
    admin: z.boolean(),
    username: z.string(),
    email: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    language: z.string(),
  }),
});

export type AccountDetailsResponse = z.infer<
  typeof AccountDetailsResponseSchema
>;

export type AccountDetails = AccountDetailsResponse['attributes'];
