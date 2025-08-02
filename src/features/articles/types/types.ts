import type { Keyword } from "@/features/keywords/types/types";

export type Article = {
  id: number;
  keyword: Keyword;
  title: string;
  content: string;
  link: string;
  reporter: string;
  publishedAt: string;
  press: string;
  summary: string;
  views: number;
  scrapCount: number;
  createdAt: string;
  updatedAt: string;
};
