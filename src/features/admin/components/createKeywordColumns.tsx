import { Checkbox } from '@/components/ui/checkbox';
import type { KeywordWithVideo } from '@/features/keywords/types/types';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<KeywordWithVideo>();

export const createKeywordColumns = () => [
  columnHelper.display({
    id: '선택',
    header: '선택',
    cell: ({ row, table }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            if (value) {
              table.resetRowSelection();
              row.toggleSelected(!!value);
            }
          }}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('id', {
    header: 'ID',
  }),
  columnHelper.accessor('name', {
    header: '이름',
  }),
  columnHelper.accessor('category.name', {
    header: '카테고리',
  }),
  columnHelper.accessor('description', {
    header: '설명',
  }),
];
