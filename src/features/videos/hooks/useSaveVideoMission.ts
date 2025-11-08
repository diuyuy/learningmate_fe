import { useMutation } from '@tanstack/react-query';
import { saveVideoMission } from '@/features/videos/api/api';

export const useSaveVideoMission = (keywordId: number) => {
  return useMutation({
    mutationFn: () => saveVideoMission(keywordId),
  });
};
