import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { QUERY_KEYS } from '@/constants/querykeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateQuiz } from '../api/api';
import type { useQuizForm } from '../hooks/useQuizForm';
import type { QuizForm } from '../types/types';
import QuizFormController from './QuizFormController';

type Props = {
  form: ReturnType<typeof useQuizForm>;
  resetForm: () => void;
  quizId: number;
  articleId: number;
  quizIdx: number;
};

export default function UpdateQuizForm({
  form,
  resetForm,
  quizId,
  articleId,
  quizIdx,
}: Props) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: [QUERY_KEYS.QUIZZES, { articleId, quizIdx }],
    mutationFn: async (quizForm: QuizForm) => updateQuiz(quizId, quizForm),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.QUIZZES, { articleId }],
      });
      toast.success('퀴즈 수정이 완료되었습니다.', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  const onSubmit = (quizForm: QuizForm) => {
    mutation.mutate(quizForm);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>퀴즈 {quizIdx + 1}</CardTitle>
          <CardAction>
            <div className='flex gap-4'>
              <Button
                type='button'
                variant={'outline_semibold'}
                onClick={resetForm}
                disabled={!form.formState.isDirty}
              >
                리셋
              </Button>
              <Button
                type='submit'
                variant={'primary_semibold'}
                disabled={!form.formState.isDirty}
              >
                수정
              </Button>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <QuizFormController form={form} name='description' />
            <QuizFormController form={form} name='answer' />
            <QuizFormController form={form} name='question1' />
            <QuizFormController form={form} name='question2' />
            <QuizFormController form={form} name='question3' />
            <QuizFormController form={form} name='question4' />
            <QuizFormController form={form} name='explanation' />
          </FieldGroup>
        </CardContent>
      </Card>
    </form>
  );
}
