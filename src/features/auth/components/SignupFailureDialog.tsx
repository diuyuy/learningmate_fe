import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { XCircle } from 'lucide-react';

interface SignupFailureDialogProps {
  open: boolean;
  onClose: () => void;
  errorMessage?: string;
}

export default function SignupFailureDialog({
  open,
  onClose,
  errorMessage = '회원가입 중 오류가 발생했습니다.',
}: SignupFailureDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent showCloseButton={true} className='sm:max-w-md'>
        <DialogHeader className='items-center text-center'>
          <div className='mb-4 flex justify-center'>
            <div className='rounded-full bg-red-100 p-4'>
              <XCircle className='h-12 w-12 text-red-600' />
            </div>
          </div>
          <DialogTitle className='text-2xl'>회원가입 실패</DialogTitle>
          <DialogDescription className='text-base text-center'>
            {errorMessage}
            <br />
            다시 시도해 주세요.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='sm:justify-center'>
          <Button
            onClick={onClose}
            variant='destructive'
            className='w-full sm:w-auto px-8'
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
