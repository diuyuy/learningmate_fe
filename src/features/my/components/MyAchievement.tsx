import AchievementSummary from '@/features/my/components/AchievementSummary';

import {
  useStudyAchievement,
  useStudyCategoryStats,
} from '@/features/my/hooks/useStudyAchievement';
import CategoryPie from './CategoryPie';

// ✅ 임시 디버그용 JSON 뷰어
// function JsonBlock({
//   title,
//   state,
// }: {
//   title: string;
//   state: {
//     isLoading: boolean;
//     isError?: boolean;
//     error?: unknown;
//     data?: unknown;
//     refetch?: () => void;
//   };
// }) {
//   return (
//     <div className='rounded-xl border p-3 text-sm'>
//       <div className='mb-2 flex items-center justify-between'>
//         <strong>{title}</strong>
//         <button
//           type='button'
//           className='rounded-md border px-2 py-1 text-xs hover:bg-zinc-50'
//           onClick={() => state.refetch?.()}
//         >
//           다시 불러오기
//         </button>
//       </div>
//       {state.isLoading ? (
//         <div className='text-zinc-500'>loading…</div>
//       ) : state.isError ? (
//         <pre className='whitespace-pre-wrap break-words text-red-600'>
//           {String((state.error as any)?.message ?? state.error)}
//         </pre>
//       ) : (
//         <pre className='overflow-auto whitespace-pre-wrap break-words'>
//           {JSON.stringify(state.data, null, 2)}
//         </pre>
//       )}
//     </div>
//   );
// }

export default function MyAchievement() {
  // /api/v1/members/me/study-achivements
  const achievementQ = useStudyAchievement();
  // /api/v1/members/me/study-category-statistics
  const categoryStatsQ = useStudyCategoryStats();

  return (
    <div className='space-y-4 md:space-y-6'>
      {/* 실제 화면 카드들 */}
      <AchievementSummary
        achievement={achievementQ.data}
        isLoading={achievementQ.isLoading}
      />
      <CategoryPie
        stats={categoryStatsQ.data}
        isLoading={categoryStatsQ.isLoading}
      />

      {/* ====== ⬇︎ 임시: API 디버그 박스 (확인용) ⬇︎ ====== */}
      {/* <div className='rounded-2xl border p-4'>
        <h4 className='mb-3 text-base font-semibold'>API 디버그 (임시)</h4>
        <div className='grid gap-3 md:grid-cols-2'>
          <JsonBlock
            title='GET /members/me/study-achivements'
            state={{
              isLoading: achievementQ.isLoading,
              isError: achievementQ.isError,
              error: achievementQ.error as any,
              data: achievementQ.data,
              refetch: achievementQ.refetch,
            }}
          />
          <JsonBlock
            title='GET /members/me/study-category-statistics'
            state={{
              isLoading: categoryStatsQ.isLoading,
              isError: categoryStatsQ.isError,
              error: categoryStatsQ.error as any,
              data: categoryStatsQ.data,
              refetch: categoryStatsQ.refetch,
            }}
          />
        </div>
      </div> */}
      {/* ====== ⬆︎ 임시: 필요 없어지면 통째로 삭제하세요 ⬆︎ ====== */}
    </div>
  );
}
