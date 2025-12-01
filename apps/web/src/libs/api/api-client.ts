import { ENV } from "../../shared/lib/env";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface RequestOptions {
  query?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  body?: unknown;
  skipAuth?: boolean;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export type GetAccessTokenFn = () => string | null;

export class ApiClient {
  private readonly baseUrl: string;
  private readonly getAccessToken?: GetAccessTokenFn;

  constructor(options?: {
    baseUrl?: string;
    getAccessToken?: GetAccessTokenFn;
  }) {
    this.baseUrl = options?.baseUrl ?? ENV.API_BASE_URL;
    this.getAccessToken = options?.getAccessToken;
  }

  private buildUrl(path: string, query?: RequestOptions["query"]): string {
    const url = new URL(path, this.baseUrl);

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private buildHeaders(options?: RequestOptions): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    };

    if (!options?.skipAuth && this.getAccessToken) {
      const token = this.getAccessToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async request<TResponse = unknown>(
    method: HttpMethod,
    path: string,
    options: RequestOptions = {}
  ): Promise<TResponse> {
    const url = this.buildUrl(path, options.query);
    const headers = this.buildHeaders(options);

    let response: Response;

    try {
      response = await fetch(url, {
        method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
    } catch (err) {
      console.error("Network error:", err);
      throw new ApiError("Network error", 0, err);
    }

    let data: unknown = null;
    try {
      data = await response.json();
    } catch {
      // sem body ou não é JSON, beleza
    }

    if (!response.ok) {
      const anyData = data as any;

      const statusFromBody =
        typeof anyData?.statusCode === "number"
          ? anyData.statusCode
          : undefined;

      const messageFromBody =
        typeof anyData?.message === "string" ? anyData.message : undefined;

      const status = statusFromBody ?? response.status ?? 500;
      const message =
        messageFromBody ?? (response.statusText || "Internal server error"); // parênteses aqui

      throw new ApiError(message, status, data);
    }

    return data as TResponse;
  }

  get<TResponse = unknown>(
    path: string,
    options?: Omit<RequestOptions, "body">
  ) {
    return this.request<TResponse>("GET", path, options ?? {});
  }

  post<TResponse = unknown>(
    path: string,
    options?: Omit<RequestOptions, "query"> & { body?: unknown }
  ) {
    return this.request<TResponse>("POST", path, options ?? {});
  }

  put<TResponse = unknown>(
    path: string,
    options?: Omit<RequestOptions, "query"> & { body?: unknown }
  ) {
    return this.request<TResponse>("PUT", path, options ?? {});
  }

  delete<TResponse = unknown>(
    path: string,
    options?: Omit<RequestOptions, "query"> & { body?: unknown }
  ) {
    return this.request<TResponse>("DELETE", path, options ?? {});
  }
}
