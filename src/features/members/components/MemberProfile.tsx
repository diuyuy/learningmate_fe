import ProfileAvartarImage from '@/components/ProfileAvartarImage';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/features/auth/context/useSession';

export default function MemberProfile() {
  const { member } = useSession();
  if (!member) return null;

  return (
    <div className='flex w-full items-center gap-3'>
      <Avatar className='h-12 w-12'>
        <ProfileAvartarImage imgUrl={member.imageUrl} />
        <AvatarFallback>
          <Skeleton className='rounded-full' />
        </AvatarFallback>
      </Avatar>
      <div className='flex w-[160px] flex-col justify-center'>
        <h1 className='truncate text-base font-semibold'>
          {member?.nickname ?? '익명의 사용자'}
        </h1>
        <h2 className='truncate text-xs font-normal text-gray-500'>
          {member?.email}
        </h2>
      </div>
    </div>
  );
}
