import type { Article } from '@/features/articles/types/types';

export type Quiz = {
  id: number;
  article: Article;
  description: string;
  question1: string;
  question2: string;
  question3: string;
  question4: string;
  answer: number; // 1 ~ 4
  explanation: string;
};

export type MemberQuiz = {
  memberId: number;
  memberAnswer: string; // '1' | '2' | '3' | '4'
};

export type QuizItemRaw = {
  id: number;
  description: string; 
  question1: string;
  question2: string;
  question3: string; 
  question4: string;
};

export type QuizChoiceArr = {
  id:number; 
  description: string; 
  choices: string[] 
};

export type QuizSolveResponse = {
  answer:string;
  explanation?: string;
  status: string;
}