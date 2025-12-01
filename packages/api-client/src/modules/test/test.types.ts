export interface Test {
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
}

export interface CreateTestRequest {
    name: string;
    description?: string;
}

export interface CreateTestResponse extends Test { }
