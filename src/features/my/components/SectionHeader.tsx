import { PAGE_META, type PageKey } from '../config/PageMeta';

type Props = {
  page: PageKey;
  className?: string; // 필요 시 외부 여백 제어
};

export default function SectionHeader({ page, className = '' }: Props) {
  const meta = PAGE_META[page];
  return (
    <header className={className}>
      <h3 className='text-lg font-bold tracking-tight'>{meta.title}</h3>
      <p className='mt-1 text-sm text-neutral-500'>{meta.desc}</p>
    </header>
  );
}
