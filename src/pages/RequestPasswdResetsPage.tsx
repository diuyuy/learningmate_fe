import { Button } from '@/components/ui/button';
import { Field, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { requestResetLink } from '@/features/auth/api/api';
import {
  EmailFormSchema,
  type EmailFormData,
} from '@/features/auth/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';
import { CheckCircle, AlertCircle } from 'lucide-react';

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
  const form = useForm<EmailFormData>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: {
      email: '',
    },
  });
  const [checkEmail, setCheckEmail] = useState<SendMail>({
    isPending: false,
    unknown: true,
  });

  const onSubmit = async (data: EmailFormData) => {
    setCheckEmail({ isPending: true });
    try {
      await requestResetLink(data.email);
      setCheckEmail({
        success: true,
        isPending: false,
        unknown: false,
      });
    } catch (error) {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
        <Controller
          control={form.control}
          name='email'
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                autoComplete='email'
                placeholder='이메일을 입력하세요...'
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button
          type='submit'
          size={'lg'}
          className='w-full mt-4 mb-2 text-md font-semibold'
          disabled={
            checkEmail.isPending || (!checkEmail.unknown && checkEmail.success)
          }
        >
          변경 링크 전송하기
        </Button>
        {checkEmail.isPending ? (
          <div className='flex flex-col items-center justify-center gap-3 mt-6 py-4'>
            <ClipLoader color='#3b82f6' size={32} />
            <p className='text-sm text-gray-600'>이메일을 전송하는 중...</p>
          </div>
        ) : checkEmail.unknown ? null : checkEmail.success ? (
          <div className='mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300'>
            <CheckCircle className='size-5 text-green-600 flex-shrink-0 mt-0.5' />
            <div className='flex flex-col gap-1'>
              <p className='text-sm font-semibold text-green-900'>
                이메일이 전송되었습니다!
              </p>
              <p className='text-xs text-green-700'>
                받은 편지함을 확인해 주세요. 이메일이 보이지 않는다면 스팸함도 확인해 보세요.
              </p>
            </div>
          </div>
        ) : (
          <div className='mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300'>
            <AlertCircle className='size-5 text-red-600 flex-shrink-0 mt-0.5' />
            <div className='flex flex-col gap-1'>
              <p className='text-sm font-semibold text-red-900'>
                오류가 발생했습니다
              </p>
              <p className='text-xs text-red-700'>
                예상치 못한 에러가 발생했습니다. 다시 시도해주세요.
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
