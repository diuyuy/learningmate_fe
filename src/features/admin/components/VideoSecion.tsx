import { Button } from '@/components/ui/button';
import YouTube from 'react-youtube';
import { useVideoForm } from '../hooks/useVideoForm';

type Props = {
  videoUrl?: string;
};

export default function VideoSection({ videoUrl }: Props) {
  const form = useVideoForm();

  const extractVideoId = (url?: string) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 0,
    },
  };

  const videoId = extractVideoId(videoUrl);

  return (
    <section>
      <h2 className='text-2xl font-bold'>Videos</h2>
      <div className='mt-4 flex flex-wrap justify-between'>
        <div className='mb-4 flex flex-col gap-4 items-start'>
          <form className='flex flex-col'>
            {/* <FormField
              control={form.control}
              name='videoUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            /> */}
            <Button type='submit' variant={'secondary_semibold'}>
              비디오 수정
            </Button>
          </form>
        </div>
        {videoId ? (
          <YouTube videoId={videoId} opts={opts} />
        ) : (
          <div className='border border-gray-400 rounded-md w-[640px] aspect-video flex items-center justify-center'>
            선택된 영상이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}
