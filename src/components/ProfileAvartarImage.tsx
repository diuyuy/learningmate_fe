import { AvatarImage } from '@/components/ui/avatar';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

type Props = {
  imgUrl?: string;
} & React.ComponentProps<typeof AvatarPrimitive.Image>;

export default function ProfileAvartarImage({ imgUrl, ...props }: Props) {
  return (
    <>
      <AvatarImage
        src={!!imgUrl ? imgUrl : 'https://github.com/shadcn.png'}
        {...props}
      />
    </>
  );
}
