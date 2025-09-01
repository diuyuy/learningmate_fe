import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Props = {
  isOpen: boolean;
  setCheckWithdrawDialog: () => void;
  deleteAccount: () => void;
};

export default function CheckWithdrawDialog({
  isOpen,
  deleteAccount,
  setCheckWithdrawDialog,
}: Props) {
  return (
    <Dialog open={isOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>정말로 탈퇴하시겠습니까?</DialogTitle>
        </DialogHeader>
        <p>계정을 탈퇴하시면 그동안 저장된 데이터는 복구하실 수 없습니다.</p>
        <DialogFooter className='flex justify-end gap-2'>
          <Button variant={'outline_semibold'} onClick={setCheckWithdrawDialog}>
            취소
          </Button>
          <Button variant={'destructive_semibold'} onClick={deleteAccount}>
            탈퇴
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
