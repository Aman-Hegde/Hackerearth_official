export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export class ApiError<TData = unknown> extends Error {
  status: number;
  code?: string;
  data?: TData;

  constructor({
    status,
    code,
    message,
    data,
  }: {
    status: number;
    code?: string;
    message: string;
    data?: TData;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

const isJsonBody = (body: RequestInit["body"]): boolean => {
  return Boolean(body) && typeof body === "string";
};

const hasContentType = (headers: Headers): boolean => {
  return headers.has("Content-Type");
};

const parseJsonSafely = async (response: Response): Promise<unknown> => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const getErrorMessage = (data: unknown): string => {
  if (
    data &&
    typeof data === "object" &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return "Request failed. Please try again.";
};

const getErrorCode = (data: unknown): string | undefined => {
  if (
    data &&
    typeof data === "object" &&
    "code" in data &&
    typeof data.code === "string"
  ) {
    return data.code;
  }

  return undefined;
};

export const apiRequest = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const headers = new Headers(options.headers);

  if (isJsonBody(options.body) && !hasContentType(headers)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: options.credentials ?? "include",
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new ApiError({
      status: response.status,
      code: getErrorCode(data),
      message: getErrorMessage(data),
      data,
    });
  }

  return data as T;
};
