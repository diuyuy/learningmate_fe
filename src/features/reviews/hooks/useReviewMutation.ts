// src/features/reviews/hooks/useReviewMutations.ts
import { QUERY_KEYS } from '@/constants/querykeys';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { deleteReview, postReview, updateReview } from '../api/api';
import type { ReviewForm, ReviewResponse } from '../types/types';

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
  await qc.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEWS, 'me'] });
};

export function useUpdateReviewMutation(
  articleId: number,
  reviewId: number,
  options?: UseMutationOptions<ReviewResponse, AxiosError, ReviewForm>
) {
  const qc = useQueryClient();

  return useMutation<ReviewResponse, AxiosError, ReviewForm>({
    mutationKey: [QUERY_KEYS.REVIEW, 'update', articleId, reviewId],
    // 🔧 AxiosResponse -> ReviewResponse로 매핑
    mutationFn: async (payload: ReviewForm) => {
      const res = await updateReview(payload, reviewId);
      // res가 AxiosResponse<ReviewResponse> 라면:
      return (res as any).data as ReviewResponse;
      // 만약 updateReview가 이미 ReviewResponse를 준다면 위 한 줄을 `return res;`로 바꿔주세요.
    },
    onSuccess: async (updated, variables, ctx) => {
      alert('수정이 완료되었습니다.');

      // ✅ 단건 캐시 즉시 갱신 (useReviewQuery 키에 맞춤)
      qc.setQueryData([QUERY_KEYS.REVIEW, articleId], updated);

      // 보수적 무효화
      await qc.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEW, articleId] });

      // ✅ 내 리뷰 목록 최신화
      await invalidateMyReviews(qc);

      options?.onSuccess?.(updated, variables, ctx);
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
  const qc = useQueryClient();

  return useMutation<unknown, AxiosError, void>({
    mutationKey: [QUERY_KEYS.REVIEW, 'delete', articleId, reviewId],
    mutationFn: () => deleteReview(reviewId), // void | unknown ok
    onSuccess: async (data, variables, ctx) => {
      alert('리뷰가 삭제되었습니다.');

      // ✅ 단건 캐시를 즉시 "없음" 상태로
      qc.setQueryData([QUERY_KEYS.REVIEW, articleId], null);

      // 보수적 무효화
      await qc.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEW, articleId] });

      // ✅ 내 리뷰 목록 최신화
      await invalidateMyReviews(qc);

      options?.onSuccess?.(data, variables, ctx);
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
  options?: UseMutationOptions<ReviewResponse, AxiosError, ReviewForm>
) {
  const qc = useQueryClient();

  return useMutation<ReviewResponse, AxiosError, ReviewForm>({
    mutationKey: [QUERY_KEYS.REVIEW, 'create', articleId],
    // 🔧 AxiosResponse -> ReviewResponse로 매핑
    mutationFn: async (payload: ReviewForm) => {
      const res = await postReview(payload, articleId);
      return (res as any).data as ReviewResponse;
    },
    onSuccess: async (created, variables, ctx) => {
      alert('작성이 완료되었습니다.');

      // ✅ 단건 캐시 즉시 갱신 → 새로고침 없이 보임
      qc.setQueryData([QUERY_KEYS.REVIEW, articleId], created);

      // 보수적 무효화(동기화)
      await qc.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEW, articleId] });

      // ✅ 내 리뷰 목록 최신화
      await invalidateMyReviews(qc);

      options?.onSuccess?.(created, variables, ctx);
    },
    onError: (err, ...rest) => {
      if (options?.onError) return options.onError(err, ...rest);
      defaultOnError(err);
    },
    ...options,
  });
}
