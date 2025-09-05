import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ROUTE_PATHS } from '@/constants/routepaths';
import { useNavigate } from 'react-router';

type Props = {
  isOpen: boolean;
  setWithdrawSuccessDialog: () => void;
  onAccountDeleted: () => void;
};

export default function WithdrawalSuccessDialog({
  isOpen,
  setWithdrawSuccessDialog,
  onAccountDeleted,
}: Props) {
  const navigate = useNavigate();

  const toLandingPage = () => {
    setWithdrawSuccessDialog();
    onAccountDeleted();
    navigate(ROUTE_PATHS.LANDING);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>회원 탈퇴 성공</DialogTitle>
        </DialogHeader>
        <p>
          회원 탈퇴를 성공적으로 마무리 했습니다. 그동안 Learningmate 서비스를
          이용해주셔서 감사합니다!
        </p>
        <DialogFooter>
          <Button variant={'primary_semibold'} onClick={toLandingPage}>
            홈으로 이동
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
