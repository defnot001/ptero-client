import type { AxiosInstance } from 'axios';
import { WebSocket } from 'ws';
import type {
  PowerAction,
  PteroStats,
  PteroWebsocketListeners,
  SendObjectOptions,
  WebsocketResponse,
} from '../types/types';
import { ClientEndpoints, replaceVariables } from '../util/endpoints';
import { validateResponse } from '../util/helpers';
import {
  WebsocketCredentialsSchema,
  type ConsoleDetails,
  type WebsocketCredentialsResponse,
} from '../validation/WebsocketSchema';

export default class WebsocketManager {
  private socket: WebSocket | null;
  constructor(private http: AxiosInstance) {
    this.socket = null;
  }

  private async getDetails(serverID: string): Promise<ConsoleDetails> {
    const url = replaceVariables(ClientEndpoints.consoleDetails, { serverID });

    const { data } = await this.http.get<WebsocketCredentialsResponse>(url);

    const validated = validateResponse(WebsocketCredentialsSchema, data);

    return validated.data;
  }

  private sendDataToSocket(
    socket: WebSocket | null,
    options: SendObjectOptions,
  ) {
    const { objectType, action, command } = options;

    if (!socket) throw new Error('Socket is not defined!');

    if (objectType === 'command') {
      socket.send(
        JSON.stringify({
          event: 'send command',
          args: [command],
        }),
      );
    } else if (objectType === 'state') {
      socket.send(
        JSON.stringify({
          event: 'set state',
          args: [action],
        }),
      );
    } else if (objectType === 'logs' || objectType === 'stats') {
      socket.send(
        JSON.stringify({
          event: `send ${objectType}`,
          args: [null],
        }),
      );
    }
  }

  public async connect(
    serverID: string,
    callbackfn: (successMessage: string) => void,
  ) {
    const details = await this.getDetails(serverID);

    this.socket = new WebSocket(details.socket);
    this.socket.once('open', () => {
      if (this.socket) {
        this.socket.send(
          JSON.stringify({
            event: 'auth',
            args: [details.token],
          }),
        );
      } else {
        throw new Error('Socket is not defined!');
      }
    });

    this.socket.on('message', async (data) => {
      if (!this.socket) {
        throw new Error('Socket is not defined!');
      }

      try {
        const res = JSON.parse(data.toString()) as WebsocketResponse;

        if (res.event === 'auth success') {
          callbackfn(
            `Authentification successful. Connected to server: ${serverID}.`,
          );
        }

        if (res.event === 'token expiring') {
          this.socket.send(
            JSON.stringify(await (await this.getDetails(serverID)).token),
          );
        }
      } catch (err) {
        console.error('Failed to parse JSON!');
      }
    });
  }

  public on<TEvent extends keyof PteroWebsocketListeners>(
    eventName: TEvent,
    callback: PteroWebsocketListeners[TEvent],
  ) {
    if (!callback) return;

    if (!this.socket) {
      throw new Error('Socket is not defined!');
    }

    this.socket.on('message', async (data) => {
      try {
        const response = JSON.parse(data.toString()) as WebsocketResponse;

        if (response.event === eventName) {
          if (eventName === 'auth success') {
            callback(undefined as any);
          }

          if (eventName === 'token expiring') {
            callback('Token expiring.' as any);
          }

          if (eventName === 'token expired') {
            callback('Token expired.' as any);
          }

          if (eventName === 'console output') {
            response.args?.forEach(callback as any);
          }

          if (eventName === 'stats') {
            if (!response.args?.[0]) return;
            const stats = JSON.parse(response.args[0]) as PteroStats;
            callback(stats as any);
          }

          if (eventName === 'status') {
            callback(response.args as any);
          }
        }
      } catch (err) {
        console.error('Failed to parse JSON!');
      }
    });

    this.socket.onerror = (err) => {
      callback(err as any);
    };

    this.socket.onclose = (event) => {
      callback(event as any);
    };
  }

  public close() {
    if (this.socket) {
      this.socket.close();
    }
  }

  public sendStats() {
    this.sendDataToSocket(this.socket, {
      objectType: 'stats',
    });
  }

  public sendLogs() {
    this.sendDataToSocket(this.socket, {
      objectType: 'logs',
    });
  }

  public sendCommand(command: string) {
    this.sendDataToSocket(this.socket, {
      objectType: 'command',
      command,
    });
  }

  public setState(state: PowerAction) {
    this.sendDataToSocket(this.socket, {
      objectType: 'state',
      action: state,
    });
  }
}
