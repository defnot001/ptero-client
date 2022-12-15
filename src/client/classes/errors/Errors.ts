import type { APIError } from '../../types/interfaces';

export class PterodactylError extends Error {
  public override message: string;

  public constructor(error: APIError) {
    const { code, status, detail } = error;
    super(detail);

    this.message = `Status: ${status} (${code}): ${detail}`;
  }
}

export class ValidationError extends Error {
  public override message: string;

  public constructor() {
    super();
    this.message =
      'Recieved invalid data from the API! Please report this error to the developers!';
  }
}
