import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/features/auth/context/useSession';
import { AvatarImage } from '@radix-ui/react-avatar';

export default function MemberProfile() {
  const { member } = useSession();

  return (
    <div className='w-full flex justify-start gap-3 items-center'>
      <Avatar className='w-12 h-12'>
        <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
        <AvatarFallback>
          <Skeleton className='rounded-full' />
        </AvatarFallback>
      </Avatar>
      <div className='flex flex-col justify-around w-[120px] md:w-[144px]'>
        <h1 className='text-lg truncate'>
          {member?.nickname ?? '익명의 사용자'}
        </h1>
        <h2 className='text-xs font-normal text-gray-500 truncate'>
          {member?.email}
        </h2>
      </div>
    </div>
  );
}
