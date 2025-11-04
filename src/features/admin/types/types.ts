import z from 'zod';

export type CreateArticleResponseDto = {
  jobId: string;
};

export type FetchJobStateDto = {
  state: JobState;
};

export type JobState =
  | 'completed'
  | 'failed'
  | 'delayed'
  | 'active'
  | 'waiting'
  | 'waiting-children'
  | 'unknown';

export type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

export const VideoUrlSchema = z.object({
  videoUrl: z.url({ error: '유효하지 않은 URL 형식입니다' }),
});

export type VideoUrlForm = z.infer<typeof VideoUrlSchema>;

export const ArticleSchema = z.object({
  title: z
    .string()
    .min(1, { message: '제목을 입력해주세요.' })
    .max(255, { message: '제목은 최대 255자까지 입력 가능합니다.' }),

  content: z
    .string()
    .min(100, { message: '내용은 최소 100자 이상 입력해주세요.' })
    .max(3000, { message: '내용은 최대 3000자까지 입력 가능합니다.' }),

  summary: z
    .string()
    .min(10, { message: '요약은 최소 10자 이상 입력해주세요.' })
    .max(1000, { message: '요약은 최대 1000자까지 입력 가능합니다.' }),
});

export type ArticleForm = z.infer<typeof ArticleSchema>;

export const QuizSchema = z.object({
  description: z
    .string()
    .nonempty('설명을 입력해주세요.')
    .min(10, '설명은 최소 10자 이상이어야 합니다.')
    .max(255, '설명은 최대 255자까지 입력 가능합니다.'),

  explanation: z
    .string()
    .nonempty('해설을 입력해주세요.')
    .min(10, '해설은 최소 10자 이상이어야 합니다.')
    .max(512, '해설은 최대 512자까지 입력 가능합니다.'),

  question1: z
    .string()
    .nonempty('선택지 1을 입력해주세요.')
    .max(250, '선택지 1은 최대 250자까지 입력 가능합니다.'),

  question2: z
    .string()
    .nonempty('선택지 2를 입력해주세요.')
    .max(250, '선택지 2는 최대 250자까지 입력 가능합니다.'),

  question3: z
    .string()
    .nonempty('선택지 3을 입력해주세요.')
    .max(250, '선택지 3은 최대 250자까지 입력 가능합니다.'),

  question4: z
    .string()
    .nonempty('선택지 4를 입력해주세요.')
    .max(250, '선택지 4는 최대 250자까지 입력 가능합니다.'),

  answer: z.union(
    [z.literal('1'), z.literal('2'), z.literal('3'), z.literal('4')],
    {
      error: '정답은 1, 2, 3, 4 중 하나를 선택해주세요.',
    }
  ),
});

export type QuizForm = z.infer<typeof QuizSchema>;

export const KeywordInfoSchema = z.object({
  name: z.string().nonempty().max(80),
  category: z.union([
    z.literal('과학'),
    z.literal('경제'),
    z.literal('공공'),
    z.literal('금융'),
    z.literal('경영'),
    z.literal('사회'),
  ]),
  description: z.string().nonempty().max(1320),
  date: z.string().optional(),
});

export type KeywordInfoForm = z.infer<typeof KeywordInfoSchema>;
