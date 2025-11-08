import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuizForm } from '../hooks/useQuizForm';
import { useQuizzesQuery } from '../hooks/useQuizzesQuery';
import ActionResultDialog from './ActionResultDialog';
import UpdateQuizForm from './UpdateQuizForm';

type Props = {
  articleId: number;
};

export default function EditQuizSection({ articleId }: Props) {
  const { isPending, isError, data: quizzes } = useQuizzesQuery(articleId);

  const [quizIdx, setQuizIdx] = useState(0);

  const form = useQuizForm(quizzes?.at(quizIdx));

  const resetForm = () =>
    form.reset({
      explanation: quizzes?.at(quizIdx)?.explanation ?? '',
      description: quizzes?.at(quizIdx)?.description ?? '',
      answer: quizzes?.at(quizIdx)?.answer ?? '1',
      question1: quizzes?.at(quizIdx)?.question1,
      question2: quizzes?.at(quizIdx)?.question2,
      question3: quizzes?.at(quizIdx)?.question3,
      question4: quizzes?.at(quizIdx)?.question4,
    });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleDialogOpen = (open: boolean) => setIsDialogOpen(open);

  useEffect(() => {
    resetForm();
  }, [quizzes, quizIdx, form]);

  if (isPending) return <QuizSectionSkeleton />;
  if (isError) return <QuizSectionError />;

  return (
    <section className='w-full max-w-2xl mx-auto space-y-6'>
      {/* 헤더 */}
      <div className='space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Quiz Editor</h2>
        <p className='text-sm text-muted-foreground'>
          Article과 관련된 퀴즈를 수정할 수 있습니다 (총 5개)
        </p>
      </div>

      <Card className='shadow-sm'>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>
            Quiz {quizIdx + 1} / 5
          </CardTitle>
          <CardAction>
            <div className='flex gap-2'>
              <Button
                type='button'
                variant={'ghost'}
                onClick={() => setQuizIdx((prev) => prev - 1)}
                disabled={quizIdx === 0}
                className='hover:bg-muted transition-colors duration-200'
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                type='button'
                variant={'ghost'}
                onClick={() => setQuizIdx((prev) => prev + 1)}
                disabled={quizIdx === 4}
                className='hover:bg-muted transition-colors duration-200'
              >
                <ChevronRightIcon />
              </Button>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          <UpdateQuizForm
            form={form}
            resetForm={resetForm}
            quizId={quizzes[quizIdx].id}
            articleId={articleId}
            quizIdx={quizIdx}
          />
        </CardContent>
      </Card>
      <ActionResultDialog
        isOpen={isDialogOpen}
        handleDialogOpen={handleDialogOpen}
        content='퀴즈 수정 중 오류가 발생했습니다. 다시 시도해 주세요.'
      />
    </section>
  );
}

function QuizSectionSkeleton() {
  return (
    <section className='w-full max-w-2xl mx-auto space-y-6'>
      {/* 헤더 */}
      <div className='space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Quiz Editor</h2>
        <p className='text-sm text-muted-foreground'>
          Article과 관련된 퀴즈를 수정할 수 있습니다 (총 5개)
        </p>
      </div>

      <Card className='shadow-sm'>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>
            <Skeleton className='h-7 w-24' />
          </CardTitle>
          <CardAction>
            <div className='flex gap-2'>
              <Button type='button' variant={'ghost'} disabled>
                <ChevronLeftIcon />
              </Button>
              <Button type='button' variant={'ghost'} disabled>
                <ChevronRightIcon />
              </Button>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Card className='shadow-sm'>
            <CardHeader>
              <Skeleton className='h-7 w-20' />
              <CardAction>
                <div className='flex gap-4'>
                  <Skeleton className='h-10 w-16' />
                  <Skeleton className='h-10 w-16' />
                </div>
              </CardAction>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className='space-y-2'>
                  <Skeleton className='h-5 w-24' />
                  <Skeleton className='h-10 w-full' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-5 w-16' />
                  <Skeleton className='h-10 w-20' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-5 w-20' />
                  <Skeleton className='h-10 w-full' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-5 w-20' />
                  <Skeleton className='h-10 w-full' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-5 w-20' />
                  <Skeleton className='h-10 w-full' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-5 w-20' />
                  <Skeleton className='h-10 w-full' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-5 w-24' />
                  <Skeleton className='h-24 w-full' />
                </div>
              </FieldGroup>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </section>
  );
}

function QuizSectionError() {
  return (
    <section className='w-full max-w-2xl mx-auto space-y-6'>
      {/* 헤더 */}
      <div className='space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Quiz Editor</h2>
        <p className='text-sm text-muted-foreground'>
          Article과 관련된 퀴즈를 수정할 수 있습니다 (총 5개)
        </p>
      </div>

      <div className='flex flex-col items-center justify-center py-16 px-6 border border-destructive/20 rounded-lg bg-destructive/5 shadow-sm'>
        <AlertCircle className='w-12 h-12 text-destructive mb-4' />
        <h3 className='text-lg font-semibold text-destructive mb-2'>
          퀴즈를 불러올 수 없습니다
        </h3>
        <p className='text-sm text-muted-foreground text-center'>
          잠시 후 다시 시도해주세요
        </p>
      </div>
    </section>
  );
}
