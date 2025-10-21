export type Category = {
  id: number;
  name: string; // CHAR(2)
};

export type PageResponse<T> = {
  items: T[];

  page: number;

  size: number;

  hasNext: boolean;

  totalElements: number;

  totalPages: number;
};
