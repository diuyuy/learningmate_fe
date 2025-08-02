import type { Article } from "@/features/articles/types/types";
import type { User } from "@/features/users/types/types";

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

export type UserQuiz = {
  id: number;
  quiz: Quiz;
  user: User;
  userAnswer: string; // '1' | '2' | '3' | '4'
  createdAt: string;
};
