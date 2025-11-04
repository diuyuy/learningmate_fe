import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { KeywordCategory } from '@/types/types';
import { SlidersHorizontalIcon } from 'lucide-react';
import { useKeywordTableStore } from '../store/keywordTableStore';

const CATEGORIES = [
  { value: '과학', label: '과학' },
  { value: '금융', label: '금융' },
  { value: '경제', label: '경제' },
  { value: '사회', label: '사회' },
  { value: '공공', label: '공공' },
  { value: '경영', label: '경영' },
] as const;

export default function KeywordFilterDropdown() {
  const filteringCategory = useKeywordTableStore(
    (state) => state.filteringCategory
  );
  const setFilteringCategory = useKeywordTableStore(
    (state) => state.setFilteringCategory
  );

  const handleValueChange = (value: string) => {
    if (value === 'all') {
      setFilteringCategory(null);
    } else {
      setFilteringCategory(value as KeywordCategory);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' aria-label='카테고리 필터'>
          <SlidersHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>카테고리 필터</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={filteringCategory ?? 'all'}
          onValueChange={handleValueChange}
        >
          <DropdownMenuRadioItem value='all'>전체</DropdownMenuRadioItem>
          {CATEGORIES.map((category) => (
            <DropdownMenuRadioItem key={category.value} value={category.value}>
              {category.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
