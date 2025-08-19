import { api } from '@/lib/axios';
import type {  Review, ReviewForm, ReviewProps, ReviewResponse } from '../types/types';

const SIZE = 10;

export const fetchReviews = async ({
  keywordId = 340,
  page = 0,
}: ReviewProps): Promise<Review[]> => {
  const res = await api.get(
    `/keywords/${keywordId}/reviews?page=${page}&size=${SIZE}&sort=id`
  );

  return res.data.result;
}

export const postReview = async (payload: ReviewForm, articleId: number) => {
  const response = await api.post<ReviewForm>(`/articles/${articleId}/reviews`, payload);
  return response.data;
};

// TODO: memberId 수정
export const fetchReview = async (articleId: number, memberId: number) => {
  const response = await api.get(`/articles/${articleId}/reviews/${memberId}`);
  return response.data.result as ReviewResponse;

};

// TODO: memberId 수정
export const updateReview = async (payload: ReviewForm, articleId: number, reviewId: number) => {
  const response = await api.patch(`/articles/${articleId}/reviews/${reviewId}`, payload);
  return response.data.result as ReviewResponse;
};

// TODO: memberId 수정
export const deleteReview = async (articleId: number, reviewId: number) => {
  const response = await api.delete(`/articles/${articleId}/reviews/${reviewId}`);
  return response.data;
};

