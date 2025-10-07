import z from 'zod';

export type Member = {
  id: number;
  email: string;
  nickname?: string;
  imageUrl?: string;
};

export type PasswdUpdateReq = {
  password: string;
};

export const NicknameSchema = z.object({
  nickname: z.string().min(1).max(50),
});

export type NicknameForm = z.infer<typeof NicknameSchema>;

const MAX_FILE_SIZE = 1000 * 1000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
];

export const ImageFormSchema = z.object({
  image: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, '프로필 이미지는 필수입니다.')
    .refine(
      (files) => files[0].size <= MAX_FILE_SIZE,
      '최대 파일 크기는 1MB 입니다.'
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files[0].type),
      'jpeg, jpg, png, gif 형태만 지원합니다.'
    ),
});

export type ImageForm = z.infer<typeof ImageFormSchema>;
