import type { BaseHttpClient } from '../../client/base';
import type { ApiResponse } from '../../client/types';
import type {
    Test,
    CreateTestRequest,
    CreateTestResponse,
} from './test.types';

export class TestApi {
    constructor(private client: BaseHttpClient) { }

    async getAll(): Promise<ApiResponse<Test[]>> {
        return this.client.get<Test[]>('/tests');
    }

    async create(data: CreateTestRequest): Promise<ApiResponse<CreateTestResponse>> {
        return this.client.post<CreateTestResponse>('/tests', data);
    }
}
