import { getKeywordVideo } from '@/features/videos/api/api';
import type { Video } from '@/features/videos/types/types';
import { extractYouTubeId } from '@/features/videos/utils/youtube';
import { useQuery } from '@tanstack/react-query';

export type VideoWithId = Video & {
  videoId: string | null;
};

export const keywordVideoKeys = {
  all: ['keywordVideo'] as const,
  byKeywordId: (keywordId: number) =>
    [...keywordVideoKeys.all, keywordId] as const,
};

export const useKeywordVideo = (keywordId: number) => {
  return useQuery({
    queryKey: keywordVideoKeys.byKeywordId(keywordId),
    queryFn: () => getKeywordVideo(keywordId),
    enabled: Number.isFinite(keywordId) && keywordId > 0,
    select: (data): VideoWithId => ({
      ...data,
      videoId: extractYouTubeId(data.link),
    }),
  });
};
