import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { VideoUrlForm } from '../types/types';
import { VideoUrlSchema } from '../types/types';

export const useVideoForm = (videoUrl?: string) => {
  return useForm<VideoUrlForm>({
    resolver: zodResolver(VideoUrlSchema),
    defaultValues: {
      videoUrl: videoUrl ?? '',
    },
  });
};
