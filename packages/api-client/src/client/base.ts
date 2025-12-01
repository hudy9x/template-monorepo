import type { ApiClientConfig, RequestConfig, ApiResponse } from './types';
import { InterceptorManager } from './interceptors';
import { ApiClientError } from '../errors';

export class BaseHttpClient {
    private config: ApiClientConfig;
    public interceptors: InterceptorManager;

    constructor(config: ApiClientConfig) {
        this.config = config;
        this.interceptors = new InterceptorManager();
    }

    private buildURL(url: string, params?: Record<string, string>): string {
        const fullURL = url.startsWith('http') ? url : `${this.config.baseURL}${url}`;

        if (!params) return fullURL;

        const urlObj = new URL(fullURL);
        Object.entries(params).forEach(([key, value]) => {
            urlObj.searchParams.append(key, value);
        });

        return urlObj.toString();
    }

    private mergeHeaders(customHeaders?: Record<string, string>): Record<string, string> {
        return {
            'Content-Type': 'application/json',
            ...(this.config.headers || {}),
            ...(customHeaders || {}),
        };
    }

    async request<T = unknown>(requestConfig: RequestConfig): Promise<ApiResponse<T>> {
        try {
            // Run request interceptors
            const modifiedConfig = await this.interceptors.runRequestInterceptors(requestConfig);

            const url = this.buildURL(modifiedConfig.url, modifiedConfig.params);
            const headers = this.mergeHeaders(modifiedConfig.headers);

            const fetchOptions: RequestInit = {
                method: modifiedConfig.method,
                headers,
            };

            if (modifiedConfig.data) {
                fetchOptions.body = JSON.stringify(modifiedConfig.data);
            }

            const response = await fetch(url, fetchOptions);

            if (!response.ok) {
                throw new ApiClientError(
                    `HTTP Error: ${response.status} ${response.statusText}`,
                    response.status,
                    `HTTP_${response.status}`
                );
            }

            const data = await response.json();

            const apiResponse: ApiResponse<T> = {
                data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
            };

            // Run response interceptors
            return await this.interceptors.runResponseInterceptors(apiResponse);
        } catch (error) {
            const processedError = await this.interceptors.runErrorInterceptors(error as Error);
            throw processedError;
        }
    }

    async get<T = unknown>(url: string, params?: Record<string, string>, headers?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>({ method: 'GET', url, params, headers });
    }

    async post<T = unknown>(url: string, data?: unknown, headers?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>({ method: 'POST', url, data, headers });
    }

    async put<T = unknown>(url: string, data?: unknown, headers?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>({ method: 'PUT', url, data, headers });
    }

    async delete<T = unknown>(url: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>({ method: 'DELETE', url, headers });
    }

    async patch<T = unknown>(url: string, data?: unknown, headers?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>({ method: 'PATCH', url, data, headers });
    }
}
