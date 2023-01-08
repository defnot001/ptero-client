import { z } from 'zod';

export const WebsocketCredentialsSchema = z.object({
  data: z.object({
    token: z.string(),
    socket: z.string(),
  }),
});

export type WebsocketCredentialsResponse = z.infer<
  typeof WebsocketCredentialsSchema
>;

export type ConsoleDetails = WebsocketCredentialsResponse['data'];
