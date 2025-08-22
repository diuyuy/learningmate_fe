import { z } from 'zod';

const passwordValidation = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
);

const passwordSchema = z
  .string()
  .min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  .regex(passwordValidation, {
    message: '비밀번호는 대/소문자, 숫자, 특수문자(@$!%*?&)를 포함해야 합니다.',
  });

export const LoginFormSchema = z.object({
  email: z.email('올바른 이메일 형식이어야 합니다.'),
  password: passwordSchema,
});

export type LoginForm = z.infer<typeof LoginFormSchema>;
