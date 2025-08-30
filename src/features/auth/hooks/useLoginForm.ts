import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { LoginFormSchema, type LoginForm } from '../types/types';

export const useLoginForm = () => {
  return useForm<LoginForm>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
};
