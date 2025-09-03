import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ROUTE_PATHS } from '@/constants/routepaths';

import { Link } from 'react-router';

type Props = {
  isOpen: boolean;
};
export default function PasswdResetSuccessDialog({ isOpen }: Props) {
  return (
    <Dialog open={isOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>비밀번호 변경 성공</DialogTitle>
        </DialogHeader>
        <h1>
          비밀번호 변경을 성공하셨습니다. 로그인 페이지로 가셔서 로그인을
          완료하세요.
        </h1>
        <DialogClose>
          <Button
            asChild
            size={'lg'}
            className='w-full mt-4 font-semibold text-md'
          >
            <Link to={ROUTE_PATHS.LOGIN}>로그인 페이지로 이동</Link>
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
