import type { ApiResponse } from '../client/types';
import type { LoginResponse, RegisterResponse } from '../modules/auth/auth.types';
import type { Test, CreateTestResponse } from '../modules/test/test.types';

// Mock data
export const mockTest: Test = {
    id: 1,
    name: 'Test Item',
    description: 'Test description',
    createdAt: new Date().toISOString(),
};

export const mockLoginResponse: ApiResponse<LoginResponse> = {
    data: {
        token: 'mock-jwt-token',
        user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
        },
    },
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
};

export const mockRegisterResponse: ApiResponse<RegisterResponse> = {
    data: {
        token: 'mock-jwt-token',
        user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
        },
    },
    status: 201,
    statusText: 'Created',
    headers: new Headers(),
};

export const mockTestsResponse: ApiResponse<Test[]> = {
    data: [mockTest],
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
};

export const mockCreateTestResponse: ApiResponse<CreateTestResponse> = {
    data: mockTest,
    status: 201,
    statusText: 'Created',
    headers: new Headers(),
};

// Mock API client
export const createMockApiClient = () => {
    const createMockFn = <T>(returnValue: T) => async () => returnValue;

    return {
        auth: {
            login: createMockFn(mockLoginResponse),
            register: createMockFn(mockRegisterResponse),
            logout: createMockFn({ data: undefined, status: 200, statusText: 'OK', headers: new Headers() }),
            refreshToken: createMockFn({ data: { token: 'new-token', refreshToken: 'new-refresh-token' }, status: 200, statusText: 'OK', headers: new Headers() }),
            getCurrentUser: createMockFn({ data: { id: '1', email: 'test@example.com', name: 'Test User' }, status: 200, statusText: 'OK', headers: new Headers() }),
        },
        test: {
            getAll: createMockFn(mockTestsResponse),
            create: createMockFn(mockCreateTestResponse),
        },
    };
};
