import { BaseHttpClient } from './client/base';
import { AuthApi } from './modules/auth/auth.api';
import { TestApi } from './modules/test/test.api';
import type { ApiClientConfig } from './client/types';

// Export types
export type * from './client/types';
export type * from './modules/auth/auth.types';
export type * from './modules/test/test.types';

// Export errors
export * from './errors';

// Export client classes
export { BaseHttpClient } from './client/base';
export { InterceptorManager } from './client/interceptors';
export { AuthApi } from './modules/auth/auth.api';
export { TestApi } from './modules/test/test.api';

// Main API Client
export class ApiClient {
    private httpClient: BaseHttpClient;
    public auth: AuthApi;
    public test: TestApi;

    constructor(config: ApiClientConfig) {
        this.httpClient = new BaseHttpClient(config);
        this.auth = new AuthApi(this.httpClient);
        this.test = new TestApi(this.httpClient);
    }

    // Expose interceptors for custom configuration
    get interceptors() {
        return this.httpClient.interceptors;
    }
}

// Factory function for creating API client
export function createApiClient(config: ApiClientConfig): ApiClient {
    return new ApiClient(config);
}
