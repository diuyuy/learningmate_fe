import { api } from '@/lib/axios';

export const saveVideoMission = async (keywordId: number): Promise<void> => {
  await api.post(`/keywords/${keywordId}/videos`);
};
