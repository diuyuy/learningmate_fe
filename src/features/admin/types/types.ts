import z from 'zod';

export type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

export const VideoUrlSchema = z.object({
  videoUrl: z.url({ error: '유효하지 않은 URL 형식입니다' }),
});

export type VideoUrlForm = z.infer<typeof VideoUrlSchema>;
