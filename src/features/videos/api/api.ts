import { api } from '@/lib/axios';
import type { ApiResponse, Video } from '../types/types';

export const saveVideoMission = async (keywordId: number): Promise<void> => {
  await api.post(`/keywords/${keywordId}/videos`);
};

export const getKeywordVideo = async (keywordId: number): Promise<Video> => {
  const { data } = await api.get<ApiResponse<Video>>(
    `/keywords/${keywordId}/videos`
  );
  return data.result;
};
