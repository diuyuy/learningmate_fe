import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Outlet } from 'react-router';

function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <hr className='my-4' />
      <Footer />
    </>
  );
}

export default RootLayout;
