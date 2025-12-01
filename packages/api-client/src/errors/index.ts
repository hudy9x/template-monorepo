export class ApiClientError extends Error {
    public status?: number;
    public code?: string;
    public data?: unknown;

    constructor(message: string, status?: number, code?: string, data?: unknown) {
        super(message);
        this.name = 'ApiClientError';
        this.status = status;
        this.code = code;
        this.data = data;

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiClientError);
        }
    }
}

export class NetworkError extends ApiClientError {
    constructor(message: string = 'Network request failed') {
        super(message, undefined, 'NETWORK_ERROR');
        this.name = 'NetworkError';
    }
}

export class TimeoutError extends ApiClientError {
    constructor(message: string = 'Request timeout') {
        super(message, undefined, 'TIMEOUT_ERROR');
        this.name = 'TimeoutError';
    }
}

export class ValidationError extends ApiClientError {
    constructor(message: string, data?: unknown) {
        super(message, 400, 'VALIDATION_ERROR', data);
        this.name = 'ValidationError';
    }
}

export class UnauthorizedError extends ApiClientError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401, 'UNAUTHORIZED');
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends ApiClientError {
    constructor(message: string = 'Forbidden') {
        super(message, 403, 'FORBIDDEN');
        this.name = 'ForbiddenError';
    }
}

export class NotFoundError extends ApiClientError {
    constructor(message: string = 'Resource not found') {
        super(message, 404, 'NOT_FOUND');
        this.name = 'NotFoundError';
    }
}
