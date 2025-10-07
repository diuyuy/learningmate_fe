import { ROUTE_PATHS } from '@/constants/routepaths';
import { useSession } from '@/features/auth/context/useSession';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

export default function ProtectedRoute() {
  const { isLoggedIn, toLoginPage } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      if (!toLoginPage) return;
      alert('로그인이 필요한 화면입니다.');
      navigate(ROUTE_PATHS.LOGIN, {
        replace: true,
      });
    }
  }, [isLoggedIn, toLoginPage]);

  return isLoggedIn ? <Outlet /> : null;
}
