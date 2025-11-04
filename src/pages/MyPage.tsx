import { useEffect, useMemo, useState } from 'react';
import {
  Trophy,
  Bookmark,
  MessageSquare,
  User,
  HelpCircle,
} from 'lucide-react';
import Sidebar from '@/features/my/components/Sidebar';
import MyProfile from '@/features/my/components/MyProfile';
import MyAchievement from '@/features/my/components/MyAchievement';
import MyScrap from '@/features/my/components/MyScrap';
import MyReview from '@/features/my/components/MyReview';
import MyQuiz from '@/features/my/components/MyQuiz';

const PAGES = {
  achievement: {
    label: '학습 성취도',
    icon: Trophy,
    component: <MyAchievement />,
  },
  scrap: { label: '스크랩', icon: Bookmark, component: <MyScrap /> },
  review: { label: '내 리뷰', icon: MessageSquare, component: <MyReview /> },
  profile: { label: '프로필', icon: User, component: <MyProfile /> },
  quiz: { label: '퀴즈', icon: HelpCircle, component: <MyQuiz /> },
} as const;

export type PageKey = keyof typeof PAGES;

function getInitialPage(): PageKey {
  if (typeof window === 'undefined') return 'profile';
  const url = new URL(window.location.href);
  const byQuery = (url.searchParams.get('tab') || '').toLowerCase();
  const byHash = (
    url.hash.replace(/^#/, '').split('=')[1] || url.hash.replace(/^#/, '')
  ).toLowerCase();
  const candidate = (byQuery || byHash) as PageKey;
  return (candidate && candidate in PAGES ? candidate : 'profile') as PageKey;
}

export default function MyPage() {
  const [active, setActive] = useState<PageKey>(getInitialPage);
  const ActiveView = useMemo(() => PAGES[active].component, [active]);
  const ActiveIcon = PAGES[active].icon;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('tab', active);
    url.hash = `tab=${active}`;
    window.history.replaceState({}, '', url.toString());
  }, [active]);

  return (
    <div className='min-h-screen bg-white p-4 md:p-6'>
      <div className='mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-[260px_1fr]'>
        <Sidebar active={active} onSelect={setActive} pages={PAGES} />

        <section className='rounded-2xl border bg-white p-4 shadow-sm md:p-6'>
          {/* <div className='mb-4 flex items-center gap-2 text-lg font-semibold md:text-2xl'>
            <ActiveIcon className='h-6 w-6' />
            {PAGES[active].label}
          </div> */}
          <div className='min-h-[420px]'>{ActiveView}</div>
        </section>
      </div>
    </div>
  );
}
