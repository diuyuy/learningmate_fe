import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { SignUpFromSchema, type SignUpFormData } from '../types/types';

export const useSignUpForm = () => {
  return useForm<SignUpFormData>({
    resolver: zodResolver(SignUpFromSchema),
    defaultValues: {
      email: '',
      password: '',
      password2: '',
      authCode: '',
    },
  });
};
