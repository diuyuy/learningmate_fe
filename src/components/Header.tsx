import { ROUTE_PATHS } from '@/constants/routepaths';
import { Link } from 'react-router';
import HeaderDropDown from './HeaderDropdown';
import LogoMark from './LogoMark';

export default function Header() {
  return (
    <>
      {/* 모바일: fixed / 데스크톱: sticky */}
      <header
        className='
          fixed md:sticky top-0 z-50
          w-full
          bg-primary/90 supports-[backdrop-filter]:bg-primary/70 backdrop-blur
          border-b border-white/20 text-white
        '
      >
        {/* 본문과 동일한 컨테이너 규격 */}
        <div className='mx-auto max-w-6xl px-4 md:px-6 h-14 flex items-center justify-between'>
          <Link
            to={ROUTE_PATHS.MAIN}
            className='flex items-center gap-2 font-semibold text-lg hover:opacity-90 transition'
            aria-label='LearningMate 홈으로'
          >
            <LogoMark className='size-5 text-white' />
            <span>LearningMate</span>
          </Link>

          <HeaderDropDown />
        </div>
      </header>

      {/* 모바일에서 fixed 헤더 높이만큼 공간 확보 */}
      <div className='h-14 md:h-0' />
    </>
  );
}
