import { createApiClient } from '@local/api-client';

// Create API client instance
export const apiClient = createApiClient({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Add request interceptor to include auth token
apiClient.interceptors.addRequestInterceptor((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
    }
    return config;
});

// Add response interceptor for logging
apiClient.interceptors.addResponseInterceptor((response) => {
    console.log(`API Response: ${response.status} - ${response.statusText}`);
    return response;
});

// Add error interceptor
apiClient.interceptors.addErrorInterceptor((error) => {
    console.error('API Error:', error);
    // You can add custom error handling here, e.g., redirect to login on 401
    return error;
});

export default apiClient;
