import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { KeywordWithVideo } from '@/features/keywords/types/types';
import { formatKST } from '@/lib/timezone';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<KeywordWithVideo>();

export const createKeywordColumns = (
  onViewDetail: (keyword: KeywordWithVideo) => void,
  screenWidth: number
) => {
  return [
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
      size: 30,
    }),
    columnHelper.accessor('id', {
      header: 'ID',
      size: 40,
    }),
    columnHelper.accessor('name', {
      header: '이름',
      size: 180,
    }),
    columnHelper.accessor('date', {
      header: '날짜',
      cell: ({ getValue }) => {
        const date = getValue();
        return date ? formatKST(date, 'yyyy-MM-dd') : '-';
      },
      size: 72,
    }),
    columnHelper.accessor('category.name', {
      header: '카테고리',
      size: 60,
    }),
    columnHelper.accessor('description', {
      header: '설명',
      size: 300,
    }),

    columnHelper.display({
      id: '상세 보기',
      header: '상세 보기',
      cell: ({ row }) => {
        return (
          <Button
            variant='outline'
            size='sm'
            onClick={() => onViewDetail(row.original)}
          >
            상세 보기
          </Button>
        );
      },
      enableSorting: false,
      enableHiding: false,
      size: screenWidth < 1024 ? 100 : 60,
    }),
  ];
};
