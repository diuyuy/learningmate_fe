import { Button } from '@/components/ui/button';
import { useSession } from '@/features/auth/context/useSession';
import CheckWithdrawDialog from '@/features/members/components/CheckWithdrawDialog';
import ProfileImageField from '@/features/members/components/ProfileImageField';
import ProfileNickNameField from '@/features/members/components/ProfileNicknameField';
import ProfilePasswdField from '@/features/members/components/ProfilePasswdField';
import WithdrawalSuccessDialog from '@/features/members/components/WithdrawalSuccessDialog';
import { useDeleteMemberMutation } from '@/hooks/useDeleteMemberMutation';
import { useReducer } from 'react';

export default function MyPage() {
  const { member, updateMember, onAccountDeleted } = useSession();
  const [isCheckWithdrawDialogOpen, setCheckWithdrawDialog] = useReducer(
    (pre) => !pre,
    false
  );
  const [isWithdrawSuccessDialogOpen, setWithdrawSuccessDialog] = useReducer(
    (pre) => !pre,
    false
  );

  const mutation = useDeleteMemberMutation(setWithdrawSuccessDialog);

  const deleteAccount = () => {
    mutation.mutate();
    setCheckWithdrawDialog();
  };

  if (!member) {
    return null;
  }

  return (
    <div className='min-h-screen bg-white p-6'>
      <div className='max-w-3xl mx-auto'>
        <section className='bg-white border-2 border-yellow-400 rounded-2xl shadow-sm p-6 md:p-8'>
          <h1 className='font-semibold text-xl'>내 프로필</h1>

          <div className='mt-6 space-y-6'>
            <ProfileImageField
              imgUrl={member.imageUrl}
              updateMember={updateMember}
            />

            <ProfileNickNameField
              nickname={member.nickname}
              updateMember={updateMember}
            />

            <div className='flex items-center'>
              <div className='w-28 font-semibold'>이메일: </div>
              <div className='flex w-full justify-between items-center'>
                <span className='font-bold underline'>{member.email} </span>
              </div>
            </div>

            <ProfilePasswdField updateMember={updateMember} />
          </div>
          <div className='flex justify-end mr-2 mt-20'>
            <Button
              variant={'outline_semibold'}
              onClick={setCheckWithdrawDialog}
              className='text-red-500 hover:text-red-500'
            >
              회원 탈퇴
            </Button>
          </div>
          <CheckWithdrawDialog
            isOpen={isCheckWithdrawDialogOpen}
            setCheckWithdrawDialog={setCheckWithdrawDialog}
            deleteAccount={deleteAccount}
          />

          <WithdrawalSuccessDialog
            isOpen={isWithdrawSuccessDialogOpen}
            setWithdrawSuccessDialog={setWithdrawSuccessDialog}
            onAccountDeleted={onAccountDeleted}
          />
        </section>
      </div>
    </div>
  );
}
