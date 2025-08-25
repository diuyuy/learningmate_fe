import { Button } from '@/components/ui/button';
import { ROUTE_PATHS } from '@/constants/routepaths';
import SignUpForm from '@/features/auth/components/SignUpForm';
import { Link } from 'react-router';

export default function SignupPage() {
  return (
    <>
      <header className='bg-primary p-2 mb-2 text-primary-foreground text-center'>
        Learningmate
      </header>
      <div className='flex flex-col min-h-screen justify-center w-[280px] md:w-[400px] mx-auto'>
        <div className='text-4xl mb-10 mx-auto'>회원가입</div>
        <SignUpForm />
        <div className='mt-4'>
          계정이 있으신가요?
          <Button variant={'link'} className='ml-1'>
            <Link to={ROUTE_PATHS.LOGIN}>로그인</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
