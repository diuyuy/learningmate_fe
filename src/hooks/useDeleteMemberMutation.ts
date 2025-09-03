import { QUERY_KEYS } from '@/constants/querykeys';
import { deleteMember } from '@/features/members/api/api';
import { useMutation } from '@tanstack/react-query';

export const useDeleteMemberMutation = (
  setWithdrawSuccessDialog: () => void
) => {
  return useMutation({
    mutationKey: [QUERY_KEYS.MEMBER],
    mutationFn: deleteMember,
    onSuccess: () => {
      setWithdrawSuccessDialog();
    },
  });
};
