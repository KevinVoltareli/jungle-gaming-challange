export interface PaginationParams {
  page: number;
  size: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export function normalizePagination(
  params?: Partial<PaginationParams>
): PaginationParams {
  const page = params?.page && params.page > 0 ? params.page : 1;
  const size =
    params?.size && params.size > 0 && params.size <= 100 ? params.size : 10;
  return { page, size };
}

export function nowIso(): string {
  return new Date().toISOString();
}
