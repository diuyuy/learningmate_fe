import { z } from 'zod';

// const passwordValidation = new RegExp(
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
// );

const passwordSchema = z
  .string()
  .min(8, { error: '비밀번호는 최소 8자 이상이어야 합니다.' })
  .max(128, '비밀번호는 최대 128자 입니다.');

const emailSchema = z.email('올바른 이메일 형식이어야 합니다.');

export const LoginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginForm = z.infer<typeof LoginFormSchema>;

export const SignUpFromSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    password2: passwordSchema,
    authCode: z
      .string()
      .length(6, '인증번호는 6자리여야 합니다.')
      .regex(/^[0-9]+$/, '숫자만 입력해주세요.'),
  })
  .refine(({ password, password2 }) => password === password2, {
    path: ['password2'],
    error: '비밀번호가 일치하지 않습니다.',
  });

export type SignUpForm = z.infer<typeof SignUpFromSchema>;

export const EmailFormSchema = z.object({
  email: emailSchema,
});

export type EmailForm = z.infer<typeof EmailFormSchema>;

export const PasswordResetSchema = z
  .object({
    password: passwordSchema,
    password2: passwordSchema,
  })
  .refine(({ password, password2 }) => password === password2, {
    path: ['password2'],
    error: '비밀번호가 일치하지 않습니다.',
  });

export type PasswordResetForm = z.infer<typeof PasswordResetSchema>;

export type PasswdResetRequest = {
  email: string;
  password: string;
  authToken: string;
};
