import { saveVideoMission } from '@/features/videos/api/api';
import { useMutation } from '@tanstack/react-query';

export const useSaveVideoMission = (keywordId: number) => {
  return useMutation({
    mutationFn: () => saveVideoMission(keywordId),
  });
};
