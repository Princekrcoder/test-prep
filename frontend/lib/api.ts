const API_BASE = '/api'; // Proxied to backend via next.config.js rewrites

interface RequestOptions extends RequestInit {
  data?: unknown;
}

class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public fields?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { data, ...fetchOptions } = options;

  const response = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
    credentials: 'include', // Always send cookies
    body: data ? JSON.stringify(data) : undefined,
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const errBody = json as { error?: { code: string; message: string; fields?: Record<string, string[]> } };
    throw new ApiError(
      errBody?.error?.code ?? 'UNKNOWN_ERROR',
      errBody?.error?.message ?? `HTTP ${response.status}`,
      response.status,
      errBody?.error?.fields
    );
  }

  return (json as { data: T }).data;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: 'GET', ...options }),

  post: <T>(path: string, data?: unknown, options?: RequestOptions) =>
    request<T>(path, { method: 'POST', data, ...options }),

  patch: <T>(path: string, data?: unknown, options?: RequestOptions) =>
    request<T>(path, { method: 'PATCH', data, ...options }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: 'DELETE', ...options }),
};

export { ApiError };
