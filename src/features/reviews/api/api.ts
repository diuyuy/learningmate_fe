import { api } from '@/lib/axios';
import type {
  ArticleReviewsProp,
  Review,
  ReviewForm,
  ReviewResponse,
  TodaysKeywordReviewsProp,
} from '../types/types';

const SIZE = 10;

export const fetchReviewsByTodaysKeyword = async ({
  keywordId,
  page = 0,
}: TodaysKeywordReviewsProp): Promise<Review[]> => {
  const res = await api.get(
    `/keywords/${keywordId}/reviews?page=${page}&size=${SIZE}&sort=id,desc`
  );

  return res.data.result as Review[];
};

export const fetchReviewsByArticle = async ({
  articleId,
  page = 0,
}: ArticleReviewsProp): Promise<Review[]> => {
  const res = await api.get(
    `/articles/${articleId}/reviews?page=${page}&size=${SIZE}&ssort=id,desc`
  );

  return res.data.result as Review[];
};

export const postReview = async (payload: ReviewForm, articleId: number) => {
  const response = await api.post<ReviewForm>(
    `/articles/${articleId}/reviews`,
    payload
  );
  return response.data;
};

export const fetchReview = async (articleId: number) => {
  const response = await api.get(`/articles/${articleId}/reviews/me`);
  return response.data.result as ReviewResponse;
};

export const updateReview = async (
  payload: ReviewForm,
  articleId: number,
  reviewId: number
) => {
  const response = await api.patch(
    `/articles/${articleId}/reviews/${reviewId}`,
    payload
  );
  return response.data.result as ReviewResponse;
};

export const deleteReview = async (articleId: number, reviewId: number) => {
  const response = await api.delete(
    `/articles/${articleId}/reviews/${reviewId}`
  );
  return response.data;
};
