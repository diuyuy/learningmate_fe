import type { Member } from '@/features/members/types/types';
import { api } from '@/lib/axios';
import type { LoginForm } from '../types/types';

export const login = async (loginForm: LoginForm) => {
  const response = await api.post('/auth/sign-in', loginForm);

  return response.data.result as Member;
};

export const signOut = async () => {
  await api.post('/auth/sign-out');
};
