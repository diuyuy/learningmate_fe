export type Article = {
  id: number;
  title: string;
  content: string;
  publishedAt: string;
  summary: string;
  scrapCount: number;
  views: number;
  keywordId: number;
  scrappedByMe: boolean;
};

export type ArticlePreview = Pick<
  Article,
  'id' | 'title' | 'content' | 'publishedAt'
>;
