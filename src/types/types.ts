export type Category = {
  id: number;
  name: KeywordCategory; // CHAR(2)
};

export type KeywordCategory =
  | '과학'
  | '금융'
  | '경제'
  | '사회'
  | '공공'
  | '경영';

export type PageResponse<T> = {
  items: T[];

  page: number;

  size: number;

  hasNext: boolean;

  totalElements: number;

  totalPages: number;
};
