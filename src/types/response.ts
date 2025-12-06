export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface DataResponse<T> extends BaseResponse {
  data: T;
}

export interface PaginatedResponse<T> extends BaseResponse {
  data: T[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface ErrorResponse extends BaseResponse {
  errors?: any;
  details?: any;
}
