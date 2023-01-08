import type { AxiosInstance } from 'axios';
import WebSocket from 'ws';
import type {
  PteroServerState,
  PteroStats,
  PteroWebsocketListeners,
  WebsocketResponse,
} from '../types/types';
import { ClientEndpoints, replaceVariables } from '../util/endpoints';
import { validateResponse } from '../util/helpers';
import {
  ConsoleDetails,
  WebsocketCredentialsResponse,
  WebsocketCredentialsSchema,
} from '../validation/WebsocketSchema';

export default class WebsocketManager {
  public constructor(private http: AxiosInstance) {}

  private async getDetails(serverID: string): Promise<ConsoleDetails> {
    const url = replaceVariables(ClientEndpoints.consoleDetails, { serverID });

    const { data } = await this.http.get<WebsocketCredentialsResponse>(url);

    const validated = validateResponse(WebsocketCredentialsSchema, data);

    return validated.data;
  }

  public async connect(
    serverID: string,
    listeners: PteroWebsocketListeners,
  ): Promise<WebSocket> {
    const details = await this.getDetails(serverID);

    const ws = new WebSocket(details.socket);

    const tokenObj = {
      event: 'auth',
      args: [details.token],
    };

    ws.on('open', () => {
      ws.send(JSON.stringify(tokenObj));

      if (listeners.onOpen) {
        listeners.onOpen();
      }
    });
    ws.on('close', (code, reason) => {
      if (listeners.onClose) {
        listeners.onClose(code, reason);
      }
    });
    ws.on('error', (error) => {
      if (listeners.onError) {
        listeners.onError(error);
      }
    });

    ws.on('message', (data) => {
      const jsonData = JSON.parse(data.toString()) as WebsocketResponse;

      // server custom listeners
      if (jsonData.event === 'stats' && jsonData.args && jsonData.args[0]) {
        const stats = JSON.parse(jsonData.args[0]) as PteroStats;

        if (listeners.onStats) {
          listeners.onStats(stats);
        }
      } else if (
        jsonData.event === 'status' &&
        jsonData.args &&
        jsonData.args[0]
      ) {
        const status = jsonData.args[0] as PteroServerState;

        if (listeners.onStatus) {
          listeners.onStatus(status);
        }
      } else if (jsonData.event === 'console output' && jsonData.args) {
        if (listeners.onConsoleOutput) {
          jsonData.args.forEach(listeners.onConsoleOutput);
        }
      } else if (jsonData.event === 'auth success') {
        if (listeners.onAuthSuccess) {
          listeners.onAuthSuccess();
        }
      } else if (jsonData.event === 'token expiring') {
        if (listeners.onTokenExpiring) {
          listeners.onTokenExpiring();
        }

        this.getDetails(serverID).then((newDetails) => {
          const newTokenObj = {
            event: 'auth',
            args: [newDetails.token],
          };

          ws.send(JSON.stringify(newTokenObj));
        });
      } else if (jsonData.event === 'token expired') {
        if (listeners.onTokenExpired) {
          listeners.onTokenExpired();
        }
      }
    });

    return ws;
  }
}
