import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { requestResetLink } from '@/features/auth/api/api';
import { EmailFormSchema, type EmailForm } from '@/features/auth/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';

type SendMail =
  | {
      isPending: false;
      success: boolean;
      unknown: false;
    }
  | {
      isPending: false;
      unknown: true;
    }
  | {
      isPending: true;
    };

export default function RequestPasswdResetsPage() {
  const form = useForm<EmailForm>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: {
      email: '',
    },
  });
  const [checkEmail, setCheckEmail] = useState<SendMail>({
    isPending: false,
    unknown: true,
  });

  const onSubmit = async (data: EmailForm) => {
    setCheckEmail({ isPending: true });
    try {
      await requestResetLink(data.email);
      setCheckEmail({
        success: true,
        isPending: false,
        unknown: false,
      });
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError && error.status === 404) {
        form.setError('email', {
          message: '존재하지 않는 이메일 입니다.',
        });
        setCheckEmail({
          unknown: true,
          isPending: false,
        });
        return;
      }
      setCheckEmail({
        success: false,
        unknown: false,
        isPending: false,
      });
    }
  };

  return (
    <div className='flex flex-col items-center mt-12 w-[280px] md:w-[400px] mx-auto'>
      <h1 className='text-2xl font-bold'>비밀번호 찾기</h1>
      <div className='flex flex-col items-center mt-3 mb-4'>
        <h2>가입한 이메일을 입력해 주세요.</h2>
        <h2>가입한 이메일을 통해 이메일이 전송됩니다.</h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
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
          />
          <Button
            type='submit'
            size={'lg'}
            className='w-full mt-4 mb-2 text-md font-semibold'
            disabled={
              checkEmail.isPending ||
              (!checkEmail.unknown && checkEmail.success)
            }
          >
            변경 링크 전송하기
          </Button>
          {checkEmail.isPending ? (
            <ClipLoader color='gray' size={28} />
          ) : checkEmail.unknown ? null : checkEmail.success ? (
            <div className='text-sm text-green-500'>
              이메일이 전송되었습니다!
            </div>
          ) : (
            <div className='text-sm'>
              예상치 못한 에러가 발생했습니다. 다시 시도해주세요.
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
