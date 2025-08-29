import { AvatarImage } from '@/components/ui/avatar';
import { fetchProfileImg } from '@/features/members/api/api';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { useEffect, useState } from 'react';

type Props = {
  imgUrl?: string;
} & React.ComponentProps<typeof AvatarPrimitive.Image>;

export default function ProfileAvartarImage({ imgUrl, ...props }: Props) {
  const [objUrl, setObjUrl] = useState('');

  useEffect(() => {
    if (!imgUrl) return;
    let objectUrl: string | null = null;
    (async (imgUrl: string) => {
      objectUrl = await fetchProfileImg(imgUrl);
      setObjUrl(objectUrl);
    })(imgUrl);

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imgUrl]);

  return (
    <>
      <AvatarImage
        src={!!imgUrl ? objUrl : 'https://github.com/shadcn.png'}
        {...props}
      />
    </>
  );
}
