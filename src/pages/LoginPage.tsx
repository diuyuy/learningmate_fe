import { GoogleLoginButton } from '@/components/GoogleLoginButton';
import LoginForm from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <>
      <header className='bg-primary p-2 mb-2 text-primary-foreground text-center'>
        Learningmate
      </header>
      <div className='flex flex-col min-h-screen justify-center w-[280px] md:w-[400px] mx-auto'>
        <div className='text-4xl mb-10 mx-auto'>로그인</div>
        <LoginForm />
        <div className='text-center relative text-gray-700 before:content-[""] before:absolute before:left-0 before:top-[50%] before:bg-gray-200 before:h-[1px] before:w-[45%] after:content-[""] after:absolute after:right-0 after:top-[50%] after:bg-gray-200 after:h-[1px] after:w-[45%] my-8'>
          or
        </div>
        <div>
          <GoogleLoginButton />
        </div>
      </div>
    </>
  );
}
