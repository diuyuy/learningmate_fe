import type { AxiosError } from 'axios';
import { useParams } from 'react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSession } from '@/features/auth/context/useSession';
import { useReviewQuery } from '../hooks/useReviewQuery';
import ReviewUpdateView from './ReviewUpdateView';
import ReviewCreateForm from './ReviewCreateForm';
import { useState } from 'react';

export default function ReviewForm() {
  const { articleId } = useParams();
  const session = useSession();
  const memberId = Number(
    (session as any)?.memberId ?? (session as any)?.id ?? session
  );

  const [forceCreate, setForceCreate] = useState(false);

  if (!articleId) {
    return (
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle>ArticleID Error</CardTitle>
          <CardDescription>유효한 기사 ID가 필요합니다.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { data, isPending, isError, error } = useReviewQuery(+articleId);

  if (isPending) {
    return (
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle>로딩 중…</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (isError) {
    const ax = error as AxiosError<any>;
    const msg = ax.response?.data?.message ?? ax.message ?? '알 수 없는 오류';
    return (
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle className='text-red-500'>오류</CardTitle>
          <CardDescription className='text-red-500'>{msg}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const showCreate = forceCreate || !data;

  return (
    <Card className='mt-6 w-full'>
      <CardHeader>
        <CardTitle>기사 리뷰</CardTitle>
        <CardDescription>
          기사에 대한 내 생각을 기록하고 관리하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showCreate ? (
          <ReviewCreateForm articleId={+articleId} memberId={memberId} />
        ) : (
          <ReviewUpdateView
            articleId={+articleId}
            memberId={memberId}
            initial={data}
            onDeleted={() => setForceCreate(true)} // ✅ 삭제 시 즉시 작성 폼으로 전환
          />
        )}
      </CardContent>
    </Card>
  );
}
