import type { APIError } from '../types/interfaces';

export class PterodactylError extends Error {
  public readonly code: string;
  public readonly status: string;
  public readonly detail: string;

  public constructor(error: APIError) {
    const { code, status, detail } = error;
    super(detail);

    this.code = code;
    this.status = status;
    this.detail = detail;
  }
}
