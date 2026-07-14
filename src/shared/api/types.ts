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

export interface CursorPagination {
  nextCursor: string | null;
  hasNextPage: boolean;
  limit: number;
}

export interface PaginatedResponse<T> extends Omit<ApiSuccessResponse<T>, "data"> {
  data: T;
  pagination: CursorPagination;
}
