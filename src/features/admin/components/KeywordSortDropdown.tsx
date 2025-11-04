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
import { ArrowDownUpIcon } from 'lucide-react';
import { useKeywordTableStore } from '../store/keywordTableStore';

export default function KeywordSortDropdown() {
  const sortOrder = useKeywordTableStore((state) => state.sortOrder);
  const setSortOrder = useKeywordTableStore((state) => state.setSortOrder);

  const handleValueChange = (value: string) => {
    setSortOrder(value as 'asc' | 'desc');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' aria-label='정렬'>
          <ArrowDownUpIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>ID 정렬</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={sortOrder}
          onValueChange={handleValueChange}
        >
          <DropdownMenuRadioItem value='asc'>
            오름차순 (1→10)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='desc'>
            내림차순 (10→1)
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
