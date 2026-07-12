export interface ApiSuccessResponse<T> {
    success: true;
    message: string;
    data: T;
}

export interface ApiError {
    message: string;
    code?: string;
    status?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}