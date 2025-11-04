import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Outlet, ScrollRestoration } from 'react-router';

function RootLayout() {
  return (
    <div className='w-full min-h-screen overflow-x-hidden'>
      <div className='container mx-auto'>
        <Header />
        <Outlet />
        <ScrollRestoration
          getKey={(location) => {
            // AdminPage에서는 pathname만 사용하여 searchParams 변경 시 스크롤 유지
            if (location.pathname === '/admin') {
              return location.pathname;
            }
            // 다른 페이지에서는 기본 동작 (pathname + search)
            return location.key;
          }}
        />
        <hr className='my-4' />
        <Footer />
      </div>
    </div>
  );
}

export default RootLayout;
