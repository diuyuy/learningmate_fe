import { GoogleLoginButton } from '@/components/GoogleLoginButton';
import { ROUTE_PATHS } from '@/constants/routepaths';
import LoginForm from '@/features/auth/components/LoginForm';
import { Link } from 'react-router';

export default function LoginPage() {
  return (
    <>
      <div className='flex flex-col min-h-screen justify-center w-[280px] md:w-[400px] mx-auto'>
        <div className='text-4xl mb-10 mx-auto'>로그인</div>
        <LoginForm />
        <div className='flex gap-3 mt-4 text-sm'>
          <Link to={ROUTE_PATHS.PASSWORD_RESETS} className='underline'>
            비밀번호 찾기
          </Link>
          <Link to={ROUTE_PATHS.SIGNUP} className='underline'>
            회원가입
          </Link>
        </div>
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
