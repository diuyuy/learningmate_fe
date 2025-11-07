import type { Member } from '@/features/members/types/types';
import { api, publicApi } from '@/lib/axios';
import type {
  LoginFormData,
  PasswdResetRequest,
  SignUpFormData,
} from '../types/types';

export const login = async (loginFormDatLoginFormData: LoginFormData) => {
  const response = await publicApi.post(
    '/auth/sign-in',
    loginFormDatLoginFormData,
    {
      withCredentials: true,
    }
  );

  return response.data.result as Member;
};

export const signOut = async () => {
  await api.post('/auth/sign-out');
};

export const signUp = async (signUpFormData: SignUpFormData) => {
  await publicApi.post('/auth/sign-up', signUpFormData);
};

export const checkEmailExists = async (email: string) => {
  const response = await publicApi.get(`/auth/emails/existence?email=${email}`);

  return response.data.result as boolean;
};

export const requestAuthCode = async (email: string) => {
  await publicApi.post('/auth/send-auth-code', {
    email,
  });
};

export const validateAuthCode = async (email: string, authCode: string) => {
  try {
    await publicApi.post('/auth/auth-code/validate', {
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
  await publicApi.post('/auth/password-resets', {
    email,
  });
};

export const resetPassword = async (
  passwordResetRequest: PasswdResetRequest
) => {
  await publicApi.patch('/auth/password-resets', passwordResetRequest, {
    withCredentials: true,
  });
};
