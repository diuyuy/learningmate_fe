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
import { ClipLoader } from 'react-spinners';
import { useAuthCodeTimer } from '../hooks/useAuthCodeTimer';
import { useSignUpActions } from '../hooks/useSignUpActions';
import { useSignUpForm } from '../hooks/useSignUpForm';
import AuthCodeTimer from './AuthCodeTimer';

export default function SignUpForm() {
  const form = useSignUpForm();

  const { seconds, startTimer } = useAuthCodeTimer(3 * 60);

  const {
    checkEmail,
    validateCode,
    isRequesting,
    hasRequestedCode,
    submitIsAbled,
    requestAuthCodeAction,
    onSubmit,
    checkEmailExistsAction,
    validateAuthCodeAction,
  } = useSignUpActions(form, startTimer);

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
          {checkEmail.isPending ? (
            <ClipLoader color='gray' size={28} />
          ) : checkEmail.unknown ? null : checkEmail.isExist ? (
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
        {hasRequestedCode ? (
          <FormField
            control={form.control}
            name='authCode'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-semibold'>인증 코드 번호</FormLabel>
                <FormControl>
                  <div className='flex justify-between items-center'>
                    <Input
                      type='text'
                      placeholder='인증 코드 6자리'
                      autoComplete='authCode'
                      {...field}
                      className='w-1/2'
                    />
                    {hasRequestedCode ? (
                      <AuthCodeTimer seconds={seconds} />
                    ) : null}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        <div className='flex items-center gap-2'>
          {!hasRequestedCode || seconds === 0 ? (
            <Button
              type='button'
              variant={'outline'}
              onClick={requestAuthCodeAction}
            >
              인증 번호 요청
            </Button>
          ) : null}
          {isRequesting ? (
            <ClipLoader color='gray' size={28} />
          ) : hasRequestedCode && seconds !== 0 ? (
            <Button
              type='button'
              variant={'secondary'}
              onClick={validateAuthCodeAction}
            >
              인증 번호 확인
            </Button>
          ) : null}
          {validateCode.isPending ? (
            <ClipLoader color='gray' size={28}></ClipLoader>
          ) : validateCode.unknown ? null : validateCode.isValid ? (
            <div className='text-sm text-green-500'>인증 성공</div>
          ) : (
            <div className=' text-sm text-red-500'>인증 실패</div>
          )}
        </div>
        <Button type='submit' className='mt-2' disabled={!submitIsAbled}>
          계정 생성
        </Button>
      </form>
    </Form>
  );
}
