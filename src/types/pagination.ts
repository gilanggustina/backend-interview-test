export interface MetaPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}
export interface PaginationOptions {
  page?: number;
  perPage?: number;
}
export interface PaginationResult<T> {
  data: T[];
  meta: MetaPagination;
}
