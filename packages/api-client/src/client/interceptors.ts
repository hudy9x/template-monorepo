import type { RequestConfig, ApiResponse } from './types';

export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
export type ResponseInterceptor = <T>(response: ApiResponse<T>) => ApiResponse<T> | Promise<ApiResponse<T>>;
export type ErrorInterceptor = (error: Error) => Error | Promise<Error>;

export class InterceptorManager {
    private requestInterceptors: RequestInterceptor[] = [];
    private responseInterceptors: ResponseInterceptor[] = [];
    private errorInterceptors: ErrorInterceptor[] = [];

    addRequestInterceptor(interceptor: RequestInterceptor): void {
        this.requestInterceptors.push(interceptor);
    }

    addResponseInterceptor(interceptor: ResponseInterceptor): void {
        this.responseInterceptors.push(interceptor);
    }

    addErrorInterceptor(interceptor: ErrorInterceptor): void {
        this.errorInterceptors.push(interceptor);
    }

    async runRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
        let modifiedConfig = config;
        for (const interceptor of this.requestInterceptors) {
            modifiedConfig = await interceptor(modifiedConfig);
        }
        return modifiedConfig;
    }

    async runResponseInterceptors<T>(response: ApiResponse<T>): Promise<ApiResponse<T>> {
        let modifiedResponse = response;
        for (const interceptor of this.responseInterceptors) {
            modifiedResponse = await interceptor(modifiedResponse);
        }
        return modifiedResponse;
    }

    async runErrorInterceptors(error: Error): Promise<Error> {
        let modifiedError = error;
        for (const interceptor of this.errorInterceptors) {
            modifiedError = await interceptor(modifiedError);
        }
        return modifiedError;
    }
}
