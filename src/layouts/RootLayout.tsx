import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Outlet, ScrollRestoration } from 'react-router';

function RootLayout() {
  return (
    <div className='w-full min-h-screen overflow-x-hidden'>
      <div className='container mx-auto'>
        <Header />
        <Outlet />
        <ScrollRestoration />
        <hr className='my-4' />
        <Footer />
      </div>
    </div>
  );
}

export default RootLayout;
