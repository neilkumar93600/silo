export class AppError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const Errors = {
  unauthorized: () => new AppError(401, "unauthorized", "Authentication required"),
  forbidden: () => new AppError(403, "forbidden", "You do not have access to this resource"),
  notFound: (what = "Resource") => new AppError(404, "not_found", `${what} not found`),
  badRequest: (message: string) => new AppError(400, "bad_request", message),
  payloadTooLarge: (message: string) => new AppError(413, "payload_too_large", message),
  conflict: (message: string) => new AppError(409, "conflict", message),
};
