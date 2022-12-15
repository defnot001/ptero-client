export class ValidationError extends Error {
  public override message: string;

  public constructor() {
    super();
    this.message =
      'Recieved invalid data from the API! Please report this error to the developers!';
  }
}
