import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ArticleDetail from '@/features/articles/components/ArticleDetail';
import QuizModal from '@/features/quizzes/components/modal/QuizModal';
import ReviewForm from '@/features/reviews/components/ReviewForm';
import ReviewListInArticle from '@/features/reviews/components/ReviewListInArticle';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useSession } from '@/features/auth/context/useSession';

export default function ArticleDetailPage() {
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const { articleId } = useParams();
  const { member } = useSession();
  const memberId = member?.id;

  // 키 생성 (기사/사용자별)
  const baseKey = useMemo(
    () => (articleId && memberId ? `quiz:${memberId}:${articleId}` : null),
    [articleId, memberId]
  );
  const progressKey = baseKey ? `${baseKey}:idx` : null;
  const finishedKey = baseKey ? `${baseKey}:finished` : null;

  // 완료/진행 상태
  const [finished, setFinished] = useState(false);
  const [progressIdx, setProgressIdx] = useState(0);

  // 로컬스토리지에서 상태 읽기
  const refreshQuizState = () => {
    if (!progressKey || !finishedKey) return;
    const fin = localStorage.getItem(finishedKey) === '1';
    const prog = Math.max(
      0,
      parseInt(localStorage.getItem(progressKey) || '0', 10) || 0
    );
    setFinished(fin);
    setProgressIdx(prog);
  };

  // 처음 로드 & 모달 열고 닫힐 때 갱신
  useEffect(() => {
    refreshQuizState();
    // storage 이벤트(다른 탭 등)에도 반응
    const onStorage = (e: StorageEvent) => {
      if (e.key === finishedKey || e.key === progressKey) refreshQuizState();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressKey, finishedKey, isQuizModalOpen]);

  // 버튼 텍스트/상태
  const { label, disabled } = useMemo(() => {
    if (finished) return { label: '퀴즈 제출 완료', disabled: true };
    if (progressIdx > 0) return { label: '퀴즈 이어 풀기', disabled: false }; // 풀던 문제부터 시작
    return { label: '퀴즈 풀기', disabled: false };
  }, [finished, progressIdx]);

  return (
    <div className='flex flex-col gap-4 items-center'>
      <ArticleDetail />

      <div className='flex justify-center items-center'>
        <Button
          variant='secondary'
          onClick={() => setIsQuizModalOpen(true)}
          disabled={disabled}
        >
          {label}
        </Button>
      </div>

      <div className='w-full lg:w-2/3 flex flex-col gap-4 items-start'>
        <Separator className='my-5' />
        <ReviewForm />
        <Separator className='my-5' />
        <ReviewListInArticle articleId={Number(articleId)} />
      </div>

      {isQuizModalOpen && (
        <QuizModal
          isOpen={isQuizModalOpen}
          onClose={() => {
            setIsQuizModalOpen(false);
            // 닫힐 때도 최신 상태 반영
            refreshQuizState();
          }}
        />
      )}
    </div>
  );
}
