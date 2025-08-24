import type { Article } from '@/features/articles/types/types';
import type { Member } from '@/features/members/types/types';

export type Review = {
  id: number;
  article: Article;
  user: Member;
  content1: string;
  content2: string;
  content3: string;
  createdAt: string;
  updatedAt: string;
};

export type LikeReview = {
  id: number;
  review: Review;
  user: Member;
};

export type TodaysKeywordReviewsProp = {
  keywordId: number;
  page?: number;
  sort?: string;
};

export type ArticleReviewsProp = {
  articleId: number;
  page?: number;
  sort?: string;
};

export type ReviewForm = {
  memberId: number;
  content1: string;
  content2: string;
  content3: string;
};

export type ReviewResponse = Pick<
  Review,
  'id' | 'content1' | 'content2' | 'content3'
>;
