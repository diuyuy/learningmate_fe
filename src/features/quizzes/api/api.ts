import { api } from "@/lib/axios";
import type { MemberQuiz, QuizItemRaw, QuizSolveResponse } from "../types/types";

export const fetchQuizzes = async (articleId: number) => {
  const response = await api.get(`/articles/${articleId}/quizzes`);
    return response.data.result as QuizItemRaw[];
}

export const solveQuiz = async (answer: MemberQuiz, articleId: number, quizId: number) => {
  const response = await api.post(`/articles/${articleId}/quizzes/${quizId}`, answer);
  return response.data.result as QuizSolveResponse;
};