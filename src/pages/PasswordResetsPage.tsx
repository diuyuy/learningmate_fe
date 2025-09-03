import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ROUTE_PATHS } from '@/constants/routepaths';
import { resetPassword } from '@/features/auth/api/api';
import PasswdResetSuccessDialog from '@/features/auth/components/PasswdResetSucessDialog';
import PasswordInput from '@/features/auth/components/PasswordInput';
import {
  PasswordResetSchema,
  type PasswordResetForm,
} from '@/features/auth/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router';

export default function PasswordResetsPage() {
  const [serachParams] = useSearchParams();
  const navigate = useNavigate();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const form = useForm<PasswordResetForm>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      password: '',
      password2: '',
    },
  });

  const authToken = serachParams.get('authToken');

  const onSubmit = async (data: PasswordResetForm) => {
    if (!authToken) {
      navigate('/error');
      return;
    }
    try {
      await resetPassword({ password: data.password, authToken });
      setDialogOpen(true);
    } catch (error) {
      console.error(error);
      alert('예상치 못한 에러가 발생했습니다. 다시 시도해 주세요.');
      navigate(ROUTE_PATHS.PASSWORD_RESETS);
    }
  };

  useEffect(() => {
    if (!authToken) {
      navigate('/error');
    }
  }, []);

  return (
    <div className='flex flex-col items-center gap-2 mt-12 w-[280px] md:w-[400px] mx-auto'>
      <h1 className='text-2xl font-bold'>비밀번호 변경</h1>
      <h2>변경할 비밀번호를 입력해 주세요.</h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full mt-2 flex flex-col gap-2'
        >
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-md font-semibold'>
                  비밀번호
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    autoComplete='password'
                    placeholder='비밀번호를 입력하세요...'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password2'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-md font-semibold mt-2'>
                  비밀번호 확인
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    autoComplete='password'
                    placeholder='비밀번호를 입력하세요...'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            size={'lg'}
            className='w-full mt-4 mb-2 font-semibold'
          >
            비밀번호 변경
          </Button>
        </form>
      </Form>
      <PasswdResetSuccessDialog isOpen={isDialogOpen} />
    </div>
  );
}
