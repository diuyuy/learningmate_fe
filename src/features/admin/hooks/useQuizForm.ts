import type { QuizDetail } from '@/features/quizzes/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { QuizSchema } from '../types/types';

export const useQuizForm = (quiz?: QuizDetail) => {
  return useForm({
    resolver: zodResolver(QuizSchema),
    defaultValues: {
      description: quiz?.description ?? '',
      explanation: quiz?.explanation ?? '',
      answer: quiz?.answer ?? '1',
      question1: quiz?.question1 ?? '',
      question2: quiz?.question2 ?? '',
      question3: quiz?.question3 ?? '',
      question4: quiz?.question4 ?? '',
    },
  });
};
