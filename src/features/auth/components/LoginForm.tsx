import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router';
import { login } from '../api/api';
import { useSession } from '../context/useSession';
import { useLoginForm } from '../hooks/useLoginForm';
import type { LoginForm } from '../types/types';

export default function LoginForm() {
  const form = useLoginForm();
  const { provideSession } = useSession();
  const navigate = useNavigate();
  const { callbackUrl } = useParams();

  const onSubmit = async (data: LoginForm) => {
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-3 mx-auto w-full'
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold'>이메일</FormLabel>
              <FormControl>
                <Input
                  autoComplete='email'
                  placeholder='이메일을 입력하세요...'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold'>비밀번호</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='비밀번호를 입력하세요...'
                  autoComplete='current-password'
                  className='font-sans'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='mt-2'>
          로그인
        </Button>
      </form>
    </Form>
  );
}
