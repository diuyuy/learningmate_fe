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
import { CheckCircle2 } from 'lucide-react';

import { Link } from 'react-router';

type Props = {
  isOpen: boolean;
};
export default function PasswdResetSuccessDialog({ isOpen }: Props) {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className='sm:max-w-md'
      >
        <DialogHeader className='items-center text-center'>
          <div className='mb-4 flex justify-center'>
            <div className='rounded-full bg-green-100 p-4'>
              <CheckCircle2 className='h-12 w-12 text-green-600' />
            </div>
          </div>
          <DialogTitle className='text-2xl'>비밀번호 변경 완료!</DialogTitle>
          <DialogDescription className='text-base text-center'>
            비밀번호가 성공적으로 변경되었습니다.
            <br />
            새로운 비밀번호로 로그인해주세요.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='sm:justify-center'>
          <Button asChild className='w-full sm:w-auto px-8'>
            <Link to={ROUTE_PATHS.LOGIN}>로그인 페이지로 이동</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
