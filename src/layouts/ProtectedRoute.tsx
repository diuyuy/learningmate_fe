import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ROUTE_PATHS } from '@/constants/routepaths';
import { useSession } from '@/features/auth/context/useSession';
import { ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';

export default function ProtectedRoute() {
  const { isLoggedIn, toLoginPage } = useSession();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      if (!toLoginPage) return;
      setShowDialog(true);
    }
  }, [isLoggedIn, toLoginPage]);

  const handleLoginRedirect = () => {
    setShowDialog(false);
    navigate(ROUTE_PATHS.LOGIN, {
      replace: true,
    });
  };

  const handleLandingRedirect = () => {
    setShowDialog(false);
    navigate(ROUTE_PATHS.LANDING, {
      replace: true,
    });
  };

  return (
    <>
      {isLoggedIn ? <Outlet /> : null}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          showCloseButton={false}
          className='sm:max-w-md'
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <div className='flex items-center justify-center mb-4'>
              <div className='rounded-full bg-amber-100 p-3'>
                <ShieldAlert className='h-6 w-6 text-amber-600' />
              </div>
            </div>
            <DialogTitle className='text-center text-xl'>
              로그인이 필요합니다
            </DialogTitle>
            <DialogDescription className='text-center pt-2'>
              이 페이지를 이용하시려면 로그인이 필요합니다.
              <br />
              로그인 페이지로 이동하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='sm:justify-center gap-2'>
            <Button
              type='button'
              variant={'outline_semibold'}
              onClick={handleLandingRedirect}
            >
              랜딩 페이지로 이동
            </Button>
            <Button
              type='button'
              variant={'primary_semibold'}
              onClick={handleLoginRedirect}
            >
              로그인 페이지로 이동
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
