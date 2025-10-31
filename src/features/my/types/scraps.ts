export type ScrapItem = {
  id: number;
  title: string;
  excerpt?: string;
  content: string;
  publishedAt: string;
  date?: string;
  views?: number;
  scrappedByMe: boolean;
};

export type ScrapPage = {
  items: ScrapItem[];
  page: number;
  size: number;
  hasNext: boolean;
  totalElements: number;
  totalPages: number;
};
