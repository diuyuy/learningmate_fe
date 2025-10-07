import type { Member } from '@/features/members/types/types';
import { api } from '@/lib/axios';
import type { LoginForm, PasswdResetRequest, SignUpForm } from '../types/types';

export const login = async (loginForm: LoginForm) => {
  const response = await api.post('/auth/sign-in', loginForm);

  return response.data.result as Member;
};

export const signOut = async () => {
  await api.post('/auth/sign-out');
};

export const signUp = async (signUpForm: SignUpForm) => {
  await api.post('/auth/sign-up', signUpForm);
};

export const checkEmailExists = async (email: string) => {
  const response = await api.get(`/auth/emails/existence?email=${email}`);

  return response.data.result as boolean;
};

export const requestAuthCode = async (email: string) => {
  await api.post('/auth/send-auth-code', {
    email,
  });
};

export const validateAuthCode = async (email: string, authCode: string) => {
  try {
    await api.post('/auth/auth-code/validate', {
      email,
      authCode,
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const requestResetLink = async (email: string) => {
  await api.post('/auth/passwd-resets', {
    email,
  });
};

export const resetPassword = async (
  passwordResetRequest: PasswdResetRequest
) => {
  await api.patch('/auth/passwd-resets', passwordResetRequest);
};
