import type { KeywordWithVideo } from '@/features/keywords/types/types';
import type { Video } from '@/features/videos/types/types';
import { api } from '@/lib/axios';
import type { PageResponse } from '@/types/types';

export const fetchKeywordsByPage = async ({
  pageParam,
}: {
  pageParam: number;
}) => {
  try {
    const response = await api.get('/admin/keywords', {
      params: {
        page: pageParam,
        size: 10,
        sort: 'id,asc',
      },
    });

    console.log(response.data.result);

    return response.data.result as PageResponse<KeywordWithVideo>;
  } catch (error) {
    console.error('error:', error);
    throw Error('sdfsdf');
  }
};

export const createVideo = async (keywordId: number, videoUrl: string) => {
  const response = await api.post<Video>(
    `/admin/keywords/${keywordId}/videos`,
    {
      videoUrl,
    }
  );

  return response.data;
};

export const updateVideo = async (videoId: number, videoUrl: string) => {
  const response = await api.patch<Video>(`/admin/videos/${videoId}`, {
    videoUrl,
  });

  return response.data;
};
