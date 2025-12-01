export interface ApiClientConfig {
    baseURL: string;
    timeout?: number;
    headers?: Record<string, string>;
}

export interface RequestConfig {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url: string;
    data?: unknown;
    headers?: Record<string, string>;
    params?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
    data: T;
    status: number;
    statusText: string;
    headers: Headers;
}

export interface ApiError {
    message: string;
    status?: number;
    code?: string;
    data?: unknown;
}
