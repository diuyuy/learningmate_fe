import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle2 } from 'lucide-react';

interface SignupSuccessDialogProps {
  open: boolean;
  onConfirm: () => void;
}

export default function SignupSuccessDialog({
  open,
  onConfirm,
}: SignupSuccessDialogProps) {
  return (
    <Dialog open={open}>
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
          <DialogTitle className='text-2xl'>회원가입 완료!</DialogTitle>
          <DialogDescription className='text-base text-center'>
            회원가입이 성공적으로 완료되었습니다.
            <br />
            로그인 페이지로 이동합니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='sm:justify-center'>
          <Button onClick={onConfirm} className='w-full sm:w-auto px-8'>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
