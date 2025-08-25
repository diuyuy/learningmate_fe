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
import { ROUTE_PATHS } from '@/constants/routepaths';
import { useState, useTransition } from 'react';
import { useNavigate } from 'react-router';
import { ClipLoader } from 'react-spinners';
import {
  checkEmailExists,
  requestAuthCode,
  signUp,
  validateAuthCode,
} from '../api/api';
import { useAuthCodeTimer } from '../hooks/useAuthCodeTimer';
import { useSignUpForm } from '../hooks/useSignUpForm';
import type { SignUpForm } from '../types/types';
import AuthCodeTimer from './AuthCodeTimer';

export default function SignUpForm() {
  const form = useSignUpForm();
  const navigate = useNavigate();

  const [isEmailExists, setIsEmailExists] = useState<boolean | null>(null);
  const [isValidAuthCode, setIsValidAuthCode] = useState<boolean | null>(null);
  const [hasRequestAuthCode, setHasRequestAuthCode] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [isRequestPending, startRequestTransition] = useTransition();
  const [isAuthCodeValidating, startValidateTransition] = useTransition();

  const checkEmailValidate = async () => {
    return form.trigger('email');
  };

  const checkEmailExistsAction = async () => {
    if (!(await checkEmailValidate())) return;
    startTransition(async () => {
      try {
        const isExist = await checkEmailExists(form.getValues().email);
        if (isExist) {
          setIsEmailExists(true);
        } else {
          setIsEmailExists(false);
        }
      } catch (error) {}
    });
  };

  const requestAuthCodeAction = async () => {
    if (!(await checkEmailValidate())) return;

    startRequestTransition(async () => {
      try {
        await requestAuthCode(form.getValues().email);
        setHasRequestAuthCode(true);
        resetTimer();
      } catch (error) {
        console.error(error);
      }
    });
  };

  const validateAuthCodeAction = async () => {
    if (!(await checkEmailValidate())) return;

    if (!(await form.trigger('authCode'))) {
      form.setError('authCode', {
        message: '유효한 인증 코드를 입력하세요.',
      });
      return;
    }

    startValidateTransition(async () => {
      const isValid = await validateAuthCode(
        form.getValues().email,
        form.getValues().authCode
      );

      setIsValidAuthCode(isValid);
    });
  };

  const onSubmit = async (data: SignUpForm) => {
    try {
      await signUp(data);

      alert('회원가입이 완료되었습니다!');
      navigate(ROUTE_PATHS.LOGIN);
    } catch (error) {
      alert('회원가입을 실패했습니다.');
    }
  };

  const isEmailAndPwdSet =
    !!form.getValues().email &&
    !!form.getValues().password &&
    !!form.getValues().password2 &&
    form.getValues().password === form.getValues().password2;

  const { seconds, resetTimer } = useAuthCodeTimer(3 * 60);

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
                <div className='flex items-center gap-2'>
                  <Input
                    autoComplete='email'
                    placeholder='이메일을 입력하세요...'
                    {...field}
                  />
                  <Button
                    type='button'
                    variant={'outline'}
                    onClick={checkEmailExistsAction}
                  >
                    중복 확인
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <div className='flex items-center gap-2'>
          {isPending ? (
            <ClipLoader color='gray' size={28} />
          ) : isEmailExists === null ? null : isEmailExists ? (
            <div className='text-sm text-red-500'>중복된 이메일 입니다.</div>
          ) : (
            <div className='text-sm text-green-500'>유효한 이메일 입니다.</div>
          )}
        </div>
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
        <FormField
          control={form.control}
          name='password2'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold'>비밀번호 확인</FormLabel>
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
        {isEmailAndPwdSet ? (
          <>
            <FormField
              control={form.control}
              name='authCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-semibold'>
                    인증 코드 번호
                  </FormLabel>
                  <FormControl>
                    <div className='flex gap-3 items-center'>
                      <Input
                        type='text'
                        placeholder='인증 코드 6자리'
                        autoComplete='authCode'
                        {...field}
                      />
                      {hasRequestAuthCode ? (
                        <AuthCodeTimer seconds={seconds} />
                      ) : null}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-2'>
              <Button
                type='button'
                variant={'outline'}
                onClick={requestAuthCodeAction}
              >
                인증 번호 요청
              </Button>
              {isRequestPending ? (
                <ClipLoader color='gray' size={28} />
              ) : hasRequestAuthCode ? (
                <Button
                  type='button'
                  variant={'secondary'}
                  onClick={validateAuthCodeAction}
                  disabled={seconds === 0}
                >
                  인증 번호 확인
                </Button>
              ) : null}
              {isAuthCodeValidating ? (
                <ClipLoader color='gray' size={28}></ClipLoader>
              ) : isValidAuthCode === null ? null : isValidAuthCode ? (
                <div className='text-sm text-green-500'>인증 성공</div>
              ) : (
                <div className=' text-sm text-red-500'>인증 실패</div>
              )}
            </div>
          </>
        ) : null}

        <Button
          type='submit'
          className='mt-2'
          disabled={
            isEmailExists !== false ||
            isValidAuthCode !== true ||
            !hasRequestAuthCode
          }
        >
          계정 생성
        </Button>
      </form>
    </Form>
  );
}
