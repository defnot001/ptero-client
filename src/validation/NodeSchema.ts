import { z } from "zod";

export const NodeDetailsResponseSchema = z.object({
  object: z.literal("node"),
  attributes: z.object({
    id: z.number(),
    uuid: z.string(),
    public: z.boolean(),
    name: z.string(),
    description: z.string(),
    location_id: z.number(),
    fqdn: z.string(),
    scheme: z.string(),
    behind_proxy: z.boolean(),
    maintenance_mode: z.boolean(),
    memory: z.number(),
    memory_overallocate: z.number(),
    disk: z.number(),
    disk_overallocate: z.number(),
    upload_size: z.number(),
    daemon_listen: z.number(),
    daemon_sftp: z.number(),
    daemon_base: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
  }),
});

export type NodeDetailsResponse = z.infer<typeof NodeDetailsResponseSchema>;

export type NodeDetails = NodeDetailsResponse["attributes"];

export const NodeConfigurationResponseSchema = z.object({
  debug: z.boolean(),
  uuid: z.string(),
  token_id: z.string(),
  token: z.string(),
  api: z.object({
    host: z.string(),
    port: z.number(),
    upload_limit: z.number(),
    ssl: z.object({
      enabled: z.boolean(),
      host: z.string(),
      port: z.number(),
    }),
  }),
  system: z.object({
    data: z.string(),
    sftp: z.object({
      bind_address: z.string(),
      port: z.number(),
    }),
    disk_overallocate: z.number(),
    memory_overallocate: z.number(),
  }),
  remote: z.string(),
});

export type NodeConfigurationResponse = z.infer<
  typeof NodeConfigurationResponseSchema
>;

export type NodeConfiguration = NodeConfigurationResponse;
