import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Outlet } from 'react-router';

function RootLayout() {
  return (
    <div className='w-full min-h-screen overflow-x-hidden'>
      <Header />
      <Outlet />
      <hr className='my-4' />
      <Footer />
    </div>
  );
}

export default RootLayout;
