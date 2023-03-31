export interface PaginationDto {
  limit: number;
  page: number;
  sort_field: string;
  sort_order: 'ASC' | 'DESC';
}

export interface PaginatedData<T> extends PaginationDto {
  total_items: number;
  total_pages: number;
  items: T[];
}
