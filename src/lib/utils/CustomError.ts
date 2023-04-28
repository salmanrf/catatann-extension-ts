export class CustomError extends Error {
  public errors: string[];
  public code: number;

  constructor(code: number, errors: string[]) {
    super();

    this.code = code;
    this.message = errors[0];
    this.errors = errors;
  }
}
