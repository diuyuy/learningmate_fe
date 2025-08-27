import { Outlet } from 'react-router';

export default function AuthLayout() {
  return (
    <>
      <header className='bg-primary p-2 mb-2 text-primary-foreground text-center'>
        Learningmate
      </header>
      <Outlet />
    </>
  );
}
