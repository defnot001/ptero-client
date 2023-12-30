import { z } from "zod";

const limits = z.object({
  memory: z.number(),
  swap: z.number(),
  disk: z.number(),
  io: z.number(),
  cpu: z.number(),
  threads: z.string(),
  oom_disabled: z.boolean(),
});

const sftpDetails = z.object({
  ip: z.string(),
  port: z.number(),
});

const featureLimits = z.object({
  databases: z.number(),
  allocations: z.number(),
  backups: z.number(),
});

const relationships = z.object({
  allocations: z.object({
    object: z.literal("list"),
    data: z.array(
      z.object({
        object: z.literal("allocation"),
        attributes: z.object({
          id: z.number(),
          ip: z.string(),
          ip_alias: z.string(),
          port: z.number(),
          notes: z.string().nullable(),
          is_default: z.boolean(),
        }),
      })
    ),
  }),
  variables: z.object({
    object: z.string().nullable(),
  }),
});

const PterodactylServerAttributes = z.object({
  server_owner: z.boolean(),
  identifier: z.string(),
  internal_id: z.number(),
  uuid: z.string(),
  name: z.string(),
  node: z.string(),
  sftp_details: sftpDetails,
  description: z.string(),
  limits: limits,
  invocation: z.string(),
  docker_image: z.string(),
  egg_features: z.array(z.string()),
  feature_limits: featureLimits,
  status: z.number().nullable(),
  is_suspended: z.boolean(),
  is_installing: z.boolean(),
  is_transferring: z.boolean(),
  relationships: relationships,
});

export const PterodactylServerSchema = z.object({
  object: z.literal("server"),
  attributes: PterodactylServerAttributes,
});

export const listServersResponseSchema = z.object({
  object: z.literal("list"),
  data: z.array(PterodactylServerSchema),
});

export const serverUsageSchema = z.object({
  object: z.literal("stats"),
  attributes: z.object({
    current_state: z
      .literal("running")
      .or(z.literal("offline"))
      .or(z.literal("starting"))
      .or(z.literal("stopping")),
    is_suspended: z.boolean(),
    resources: z.object({
      memory_bytes: z.number(),
      cpu_absolute: z.number(),
      disk_bytes: z.number(),
      network_rx_bytes: z.number(),
      network_tx_bytes: z.number(),
      uptime: z.number(),
    }),
  }),
});

export type PterodactylServer = z.infer<typeof PterodactylServerAttributes>;
export type ListServersResponse = z.infer<typeof listServersResponseSchema>;
export type ServerUsageResponse = z.infer<typeof serverUsageSchema>;

export type ServerUsage = z.infer<typeof serverUsageSchema>["attributes"];
