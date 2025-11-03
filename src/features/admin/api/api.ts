import type { Article } from '@/features/articles/types/types';
import type { KeywordWithVideo } from '@/features/keywords/types/types';
import type { Quiz, QuizDetail } from '@/features/quizzes/types/types';
import type { Video } from '@/features/videos/types/types';
import { api } from '@/lib/axios';
import type { PageResponse } from '@/types/types';
import type { ArticleForm, KeywordInfoForm, QuizForm } from '../types/types';

export const fetchKeywordsByPage = async ({
  pageParam,
  query,
}: {
  pageParam: number;
  query: string;
}): Promise<PageResponse<KeywordWithVideo>> => {
  try {
    const response = await api.get(`/admin/keywords?query=${query}`, {
      params: {
        page: pageParam,
        size: 10,
        sort: 'id,asc',
      },
    });

    return response.data.result;
  } catch (error) {
    console.error('error:', error);
    throw Error('sdfsdf');
  }
};

export const fetchQuizDetails = async (articleId: number) => {
  const response = await api.get(`/admin/articles/${articleId}/quizzes`);

  return response.data.result as QuizDetail[];
};

export const createVideo = async (keywordId: number, videoUrl: string) => {
  const response = await api.post<Video>(
    `/admin/keywords/${keywordId}/videos`,
    {
      videoUrl,
    }
  );

  return response.data;
};

export const updateVideo = async (videoId: number, videoUrl: string) => {
  const response = await api.patch<Video>(`/admin/videos/${videoId}`, {
    videoUrl,
  });

  return response.data;
};

export const createArticle = async (
  keywordId: number,
  article: ArticleForm
) => {
  const response = await api.post<Article>(
    `/admin/keywords/${keywordId}/articles`,
    article
  );

  return response.data;
};

export const updateArticle = async (
  articleId: number,
  articleForm: ArticleForm
) => {
  const response = await api.patch<Article>(
    `/admin/articles/${articleId}`,
    articleForm
  );

  return response.data;
};

export const updateQuiz = async (quizId: number, quizForm: QuizForm) => {
  const response = await api.patch<Quiz>(`/admin/quizzes/${quizId}`, quizForm);

  return response.data;
};

export const updateKeyword = async (
  keywordId: number,
  keywordForm: KeywordInfoForm
): Promise<KeywordWithVideo> => {
  const response = await api.patch(`/admin/keywords/${keywordId}`, keywordForm);

  return response.data.result;
};
