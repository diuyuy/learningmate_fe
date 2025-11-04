import type { Article } from '@/features/articles/types/types';
import type { KeywordWithVideo } from '@/features/keywords/types/types';
import type { Quiz, QuizDetail } from '@/features/quizzes/types/types';
import type { Video } from '@/features/videos/types/types';
import { api } from '@/lib/axios';
import type { PageResponse } from '@/types/types';
import type {
  ArticleForm,
  CreateArticleResponseDto,
  FetchJobStateDto,
  KeywordInfoForm,
  QuizForm,
} from '../types/types';

export const fetchKeywordsByPage = async ({
  pageParam,
  query = '',
  category,
  sortOrder,
}: {
  pageParam: number;
  query: string;
  category: string | null;
  sortOrder: 'asc' | 'desc';
}): Promise<PageResponse<KeywordWithVideo>> => {
  try {
    const response = await api.get('/admin/keywords', {
      params: {
        query,
        category,
        page: pageParam,
        size: 10,
        sort: `id,${sortOrder}`,
      },
    });

    return response.data.result;
  } catch (error) {
    console.error('error:', error);
    throw Error('Failed to fetch keywords');
  }
};

export const fetchQuizDetails = async (
  articleId: number
): Promise<QuizDetail[]> => {
  const response = await api.get(`/admin/articles/${articleId}/quizzes`);

  return response.data.result;
};

export const createVideo = async (
  keywordId: number,
  videoUrl: string
): Promise<Video> => {
  const response = await api.post(`/admin/keywords/${keywordId}/videos`, {
    videoUrl,
  });

  return response.data.result;
};

export const updateVideo = async (
  videoId: number,
  videoUrl: string
): Promise<Video> => {
  const response = await api.patch(`/admin/videos/${videoId}`, {
    videoUrl,
  });

  return response.data.result;
};

export const createArticle = async (
  keywordId: number
): Promise<CreateArticleResponseDto> => {
  const response = await api.post(`/admin/keywords/${keywordId}/articles`);

  return response.data.result;
};

export const updateArticle = async (
  articleId: number,
  articleForm: ArticleForm
): Promise<Article> => {
  const response = await api.patch(`/admin/articles/${articleId}`, articleForm);

  return response.data.result;
};

export const updateQuiz = async (
  quizId: number,
  quizForm: QuizForm
): Promise<Quiz> => {
  const response = await api.patch(`/admin/quizzes/${quizId}`, quizForm);

  return response.data.result;
};

export const fetchBatchJobState = async (
  jobId: string
): Promise<FetchJobStateDto> => {
  const response = await api.get(`/admin/batch-jobs/${jobId}`);

  return response.data.result;
};

export const updateKeyword = async (
  keywordId: number,
  keywordForm: KeywordInfoForm
): Promise<KeywordWithVideo> => {
  const response = await api.patch(`/admin/keywords/${keywordId}`, keywordForm);

  return response.data.result;
};
