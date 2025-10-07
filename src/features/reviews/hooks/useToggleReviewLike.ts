import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query';
import { likeReview, unlikeReview } from '../api/api';
import { patchLikeInCache } from '../utils/reviewLikeCache';

type Vars = { reviewId: number; currentLiked: boolean };
type Ctx = { prev: Map<string, unknown> };

export function useToggleReviewLike(keys: QueryKey[]) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId, currentLiked }: Vars) => {
      if (currentLiked) await unlikeReview(reviewId);
      else await likeReview(reviewId);
      return { reviewId, nextLiked: !currentLiked };
    },

    onMutate: async ({ reviewId, currentLiked }) => {
      await Promise.all(keys.map((k) => qc.cancelQueries({ queryKey: k })));

      const backup = new Map<string, unknown>();
      for (const k of keys) {
        const keyStr = JSON.stringify(k);
        const prev = qc.getQueryData(k);
        backup.set(keyStr, prev);
        const next = patchLikeInCache(prev, reviewId, !currentLiked);
        qc.setQueryData(k, next);
      }
      return { prev: backup } as Ctx;
    },

    onError: (_e, _v, ctx) => {
      if (!ctx?.prev) return;
      for (const [k, data] of ctx.prev.entries()) {
        qc.setQueryData(JSON.parse(k), data);
      }
    },

    onSettled: async () => {
      await Promise.all(keys.map((k) => qc.invalidateQueries({ queryKey: k })));
    },
  });
}
