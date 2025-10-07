import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RiRobot2Line } from 'react-icons/ri';

type Props = {
  summary: string;
  isOpen: boolean;
  onClose: () => void;
};

export function ArticleModal({ summary, isOpen, onClose }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className='w-[90vw] max-w-4xl sm:w-[80vw] md:w-[70vw] lg:w-[60vw] max-h-[80vh] overflow-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-3'>
            <span>
              <RiRobot2Line className='text-xl' />
            </span>
            <span>AI 요약 모달</span>
          </DialogTitle>
          <hr className='border-gray-700 border-1' />
          <DialogDescription className='flex flex-col gap-3 my-5'>
            <p>{summary}</p>
          </DialogDescription>
        </DialogHeader>
        <Button onClick={onClose} className='cursor-pointer'>
          닫기
        </Button>
      </DialogContent>
    </Dialog>
  );
}
