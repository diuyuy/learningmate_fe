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
  content: string;
  handleDialogOpen: (open: boolean) => void;
};

export default function ActionResultDialog({
  isOpen,
  content,
  handleDialogOpen,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>알림</DialogTitle>
        </DialogHeader>
        <p>{content}</p>
        <DialogFooter>
          <Button
            variant={'primary_semibold'}
            onClick={() => handleDialogOpen(false)}
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
