const DEFAULT_API_BASE_URL = "http://localhost:8000";

type Primitive = string | number | boolean;
type QueryValue = Primitive | null | undefined;

export type RequestConfig = {
  params?: Record<string, QueryValue>;
  headers?: HeadersInit;
};

function getBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");
}

function buildUrl(path: string, params?: Record<string, QueryValue>) {
  const url = new URL(`${getBaseUrl()}${path}`);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const axiosInstance = {
  async get<T>(path: string, config?: RequestConfig): Promise<T> {
    const response = await fetch(buildUrl(path, config?.params), {
      method: "GET",
      headers: config?.headers,
    });

    return parseResponse<T>(response);
  },

  async post<T>(path: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const response = await fetch(buildUrl(path, config?.params), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(config?.headers ?? {}),
      },
      body: data === undefined ? undefined : JSON.stringify(data),
    });

    return parseResponse<T>(response);
  },
};
