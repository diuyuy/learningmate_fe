import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { QUERY_KEYS } from '@/constants/querykeys';
import type { Video } from '@/features/videos/types/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import YouTube from 'react-youtube';
import { createVideo, updateVideo } from '../api/api';
import { useVideoForm } from '../hooks/useVideoForm';
import type { VideoUrlForm } from '../types/types';

type Props = {
  keywordId: number;
  video: Video | null;
};

export default function VideoSection({ keywordId, video }: Props) {
  const queryClient = useQueryClient();
  const form = useVideoForm(video?.link);
  const mutation = useMutation({
    mutationKey: [QUERY_KEYS.VIDEOS, video?.id],
    mutationFn: async ({ videoUrl }: VideoUrlForm) => {
      return !video
        ? createVideo(keywordId, videoUrl)
        : updateVideo(video.id, videoUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.KEYWORDS],
      });
    },
  });

  const extractVideoId = (url?: string) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const onSubmit = async (formData: VideoUrlForm) => {
    await mutation.mutateAsync(formData);
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  };

  const videoId = extractVideoId(video?.link);

  useEffect(() => {
    form.reset({
      videoUrl: video?.link ?? '',
    });
  }, [video, form]);

  return (
    <section>
      <h2 className='text-2xl font-bold'>Videos</h2>
      <div className='mt-4 flex flex-wrap md:flex-nowrap gap-8 justify-between'>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-xl flex flex-col gap-4 items-start'
        >
          <Controller
            name='videoUrl'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='video-url-input' className='font-semibold'>
                  videoUrl:
                </FieldLabel>
                <Input
                  {...field}
                  id='video-url-input'
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button type='submit' variant={'primary_semibold'}>
            비디오 수정
          </Button>
        </form>
        {videoId ? (
          <div className='w-full max-w-[640px] aspect-video'>
            <YouTube videoId={videoId} opts={opts} className='w-full h-full' />
          </div>
        ) : (
          <div className='border border-gray-400 rounded-md w-full  max-w-[640px] aspect-video flex items-center justify-center'>
            선택된 영상이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}
