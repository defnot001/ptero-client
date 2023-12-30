import { z } from "zod";

export const DatabaseDetailsResponseSchema = z.object({
  object: z.literal("database"),
  attributes: z.object({
    id: z.number(),
    server: z.number(),
    host: z.string(),
    database: z.string(),
    username: z.string(),
    remote: z.string(),
    max_connections: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
    relationships: z.object({
      password: z.object({
        object: z.literal("DatabasePassword"),
        attributes: z.object({
          id: z.number(),
          server: z.number(),
          database: z.number(),
          password: z.string(),
          created_at: z.string(),
          updated_at: z.string(),
        }),
      }),
      host: z.object({
        object: z.literal("database_host"),
        attributes: z.object({
          id: z.number(),
          name: z.string(),
          port: z.number(),
          host: z.string(),
          username: z.string(),
          node: z.number(),
          created_at: z.string(),
          updated_at: z.string(),
        }),
      }),
    }),
  }),
});

export type DatabaseDetailsResponse = z.infer<
  typeof DatabaseDetailsResponseSchema
>;

export type DatabaseDetails = DatabaseDetailsResponse["attributes"];
