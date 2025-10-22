import type { Dispatch, SetStateAction } from 'react';

export type SidebarProps<K extends string> = {
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
    <aside className='rounded-2xl border bg-white px-2 py-3 shadow-sm md:sticky md:top-6 self-start'>
      <nav aria-label='마이페이지'>
        <ul className='flex gap-2 md:block md:space-y-1'>
          {keys.map((k) => {
            const { label, icon: Icon } = pages[k];
            const isActive = active === k;
            return (
              <li key={k as string} className='flex-1 md:flex-none'>
                <button
                  type='button'
                  onClick={() => onSelect(k)}
                  className={[
                    'group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm transition',
                    isActive
                      ? 'bg-yellow-100/70 text-yellow-800 ring-1 ring-yellow-300'
                      : 'hover:bg-zinc-50 text-zinc-700',
                  ].join(' ')}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className='h-5 w-5 shrink-0' />
                  <span className='truncate'>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
