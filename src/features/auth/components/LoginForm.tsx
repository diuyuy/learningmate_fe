import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { AxiosError } from 'axios';
import { LockIcon, MailIcon } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { login } from '../api/api';
import { useSession } from '../context/useSession';
import { useLoginForm } from '../hooks/useLoginForm';
import type { LoginFormData } from '../types/types';
import PasswordInput from './PasswordInput';

export default function LoginForm() {
  const form = useLoginForm();
  const { provideSession } = useSession();
  const navigate = useNavigate();
  const { callbackUrl } = useParams();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const member = await login(data);
      provideSession(member);
      navigate(`/${callbackUrl ?? ''}`);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        form.setError('password', {
          message: '잘못된 이메일 주소 또는 비밀번호',
        });
      }
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className='flex flex-col gap-3 mx-auto w-full'
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name='email'
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor='form-input-email'
                className='flex gap-2 items-center font-semibold'
              >
                <MailIcon className='w-4 h-4' /> 이메일
              </FieldLabel>
              <Input
                id='form-input-email'
                autoComplete='email'
                placeholder='이메일을 입력하세요...'
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name='password'
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor='form-input-passwd'
                className='flex gap-2 items-center font-semibold'
              >
                <LockIcon className='w-4 h-4' />
                비밀번호
              </FieldLabel>
              <PasswordInput
                id='form-input-passwd'
                placeholder='비밀번호를 입력하세요...'
                autoComplete='current-password'
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type='submit' variant={'primary_semibold'} className='mt-2'>
        로그인
      </Button>
    </form>
  );
}
