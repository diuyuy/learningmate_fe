// my/components/Sidebar.tsx
import type { Dispatch, SetStateAction } from 'react';

type SidebarProps<K extends string> = {
  active: K;
  onSelect: Dispatch<SetStateAction<K>>;
  pages: Record<
    K,
    { label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }
  >;
};

export default function Sidebar<K extends string>({
  active,
  onSelect,
  pages,
}: SidebarProps<K>) {
  const keys = Object.keys(pages) as K[];

  return (
    <aside className='self-start rounded-2xl border bg-white p-3 shadow-sm md:sticky md:top-6'>
      <nav aria-label='마이페이지'>
        {/* ✅ 그룹 전체 가운데 정렬: w-fit + mx-auto 래퍼 */}
        <div className='mx-auto w-fit md:w-full'>
          {/* 모바일: 3열 그리드(고정 폭) / 데스크탑: 세로 리스트 */}
          <ul className='grid grid-cols-3 gap-2 justify-items-start md:block md:space-y-1'>
            {keys.map((k) => {
              const { label, icon: Icon } = pages[k];
              const isActive = active === k;

              return (
                // ✅ 모바일에서 각 셀의 가로폭을 동일하게 맞춰 아이콘/텍스트 x좌표 통일
                <li key={String(k)} className='w-[108px] md:w-full'>
                  <button
                    type='button'
                    onClick={() => onSelect(k)}
                    aria-current={isActive ? 'page' : undefined}
                    className={[
                      // 내부 컨텐츠는 항상 좌측 정렬
                      'flex w-full items-center justify-start gap-2 rounded-xl px-2 py-2 text-left text-xs md:px-3 md:py-2 md:text-sm',
                      isActive
                        ? 'bg-yellow-100/70 text-yellow-800 ring-1 ring-yellow-300'
                        : 'text-zinc-700 ring-1 ring-transparent hover:bg-zinc-50',
                      'cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300',
                    ].join(' ')}
                  >
                    <Icon className='h-5 w-5 shrink-0' />
                    <span className='break-words leading-tight'>{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
