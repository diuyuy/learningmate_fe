// src/features/reviews/hooks/useReviewMutations.ts
import { QUERY_KEYS } from '@/constants/querykeys';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { deleteReview, postReview, updateReview } from '../api/api';
import type { ReviewForm } from '../types/types';

function defaultOnError(error: unknown) {
  if ((error as AxiosError)?.isAxiosError) {
    const ax = error as AxiosError<{ message?: string }>;
    alert(ax.response?.data?.message ?? ax.message);
  } else if (error instanceof Error) {
    alert(error.message);
  } else {
    alert('알 수 없는 오류');
  }
}

// ✅ MyReview(내 리뷰 무한스크롤) 리스트 최신화를 위한 invalidate helper
const invalidateMyReviews = async (qc: ReturnType<typeof useQueryClient>) => {
  // [QUERY_KEYS.REVIEWS, 'me', { sort, size }] 계열 전부 무효화 (부분 일치)
  await qc.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEWS, 'me'] });
};

export function useUpdateReviewMutation(
  articleId: number,
  reviewId: number,
  options?: UseMutationOptions<unknown, AxiosError, ReviewForm>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.REVIEW, 'update', articleId, reviewId],
    mutationFn: (payload: ReviewForm) => updateReview(payload, reviewId),
    onSuccess: async (...args) => {
      alert('수정이 완료되었습니다.');

      // 단건/상세 쿼리 최신화
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REVIEW, articleId, reviewId],
      });

      // ✅ 내 리뷰 목록 최신화 (마이페이지 > 내 리뷰 즉시 반영)
      await invalidateMyReviews(queryClient);

      options?.onSuccess?.(...args);
    },
    onError: (err, ...rest) => {
      if (options?.onError) return options.onError(err, ...rest);
      defaultOnError(err);
    },
    ...options,
  });
}

export function useDeleteReviewMutation(
  articleId: number,
  reviewId: number,
  options?: UseMutationOptions<unknown, AxiosError, void>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.REVIEW, 'delete', articleId, reviewId],
    mutationFn: () => deleteReview(reviewId),
    onSuccess: async (...args) => {
      alert('리뷰가 삭제되었습니다.');

      // 단건/상세 쿼리 최신화
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REVIEW, articleId, reviewId],
      });

      // ✅ 내 리뷰 목록 최신화
      await invalidateMyReviews(queryClient);

      options?.onSuccess?.(...args);
    },
    onError: (err, ...rest) => {
      if (options?.onError) return options.onError(err, ...rest);
      defaultOnError(err);
    },
    ...options,
  });
}

export function useCreateReviewMutation(
  articleId: number,
  options?: UseMutationOptions<unknown, AxiosError, ReviewForm>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.REVIEW, 'create', articleId],
    mutationFn: (payload: ReviewForm) => postReview(payload, articleId),
    onSuccess: async (...args) => {
      alert('작성이 완료되었습니다.');

      // 아티클 별 리뷰 목록/상세 최신화
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REVIEW, articleId],
      });

      // ✅ 내 리뷰 목록 최신화
      await invalidateMyReviews(queryClient);

      options?.onSuccess?.(...args);
    },
    onError: (err, ...rest) => {
      if (options?.onError) return options.onError(err, ...rest);
      defaultOnError(err);
    },
    ...options,
  });
}
