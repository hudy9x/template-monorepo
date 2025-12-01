import type { BaseHttpClient } from '../../client/base';
import type { ApiResponse } from '../../client/types';
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
} from './auth.types';

export class AuthApi {
    constructor(private client: BaseHttpClient) { }

    async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        return this.client.post<LoginResponse>('/auth/login', credentials);
    }

    async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
        return this.client.post<RegisterResponse>('/auth/register', data);
    }

    async logout(): Promise<ApiResponse<void>> {
        return this.client.post<void>('/auth/logout');
    }

    async refreshToken(data: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> {
        return this.client.post<RefreshTokenResponse>('/auth/refresh', data);
    }

    async getCurrentUser(): Promise<ApiResponse<LoginResponse['user']>> {
        return this.client.get<LoginResponse['user']>('/auth/me');
    }
}
