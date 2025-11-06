import { ROUTE_PATHS } from '@/constants/routepaths';
import { signOut } from '@/features/auth/api/api';
import { useSession } from '@/features/auth/context/useSession';
import { useTodaysKeywordQuery } from '@/features/keywords/hooks/useTodaysKeywordQuery';
import MemberProfile from '@/features/members/components/MemberProfile';
import {
  BookOpenIcon,
  HouseIcon,
  LightbulbIcon,
  LogOutIcon,
  MenuIcon,
  UserStarIcon,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Skeleton } from './ui/skeleton';

export default function HeaderDropDown() {
  const { logout, member } = useSession();
  const navigate = useNavigate();
  const { isPending, data: todaysKeyword } = useTodaysKeywordQuery();

  const handleLogout = async () => {
    await signOut();

    navigate(ROUTE_PATHS.LANDING);
    logout();
  };

  if (isPending) {
    return <Skeleton className='size-8 rounded-md' />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='size-8 hover:cursor-pointer grid place-items-center'>
          <MenuIcon />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='font-semibold'>
        <DropdownMenuLabel className='text-md font-semibold'>
          <MemberProfile />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {todaysKeyword && member?.role === 'ADMIN' && (
            <DropdownMenuItem asChild>
              <Link
                to={`${ROUTE_PATHS.ADMIN}?keywordId=${todaysKeyword.keyword.id}`}
              >
                <UserStarIcon color='black' />
                어드민
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link to={ROUTE_PATHS.MAIN} className='w-full hover:cursor-pointer'>
              <HouseIcon color='black' />홈
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to={ROUTE_PATHS.LEARNING}
              className='w-full hover:cursor-pointer'
            >
              <LightbulbIcon color='black' />
              오늘의 키워드
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={ROUTE_PATHS.MY} className='w-full hover:cursor-pointer'>
              <BookOpenIcon color='black'></BookOpenIcon>마이페이지
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOutIcon color='black' />
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
