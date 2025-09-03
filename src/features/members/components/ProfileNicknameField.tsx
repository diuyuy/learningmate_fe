import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { updateNickname } from '../api/api';
import { NicknameSchema, type Member, type NicknameForm } from '../types/types';

type Props = {
  nickname?: string;
  updateMember: (member: Member) => void;
};

export default function ProfileNickNameField({
  nickname,
  updateMember,
}: Props) {
  const [isForm, toggleSetting] = useReducer((prev) => !prev, false);

  return (
    <>
      <div className='flex items-start'>
        <div className='w-28 font-semibold'>닉네임: </div>
        {isForm ? (
          <NicknameFormFiled
            nickname={nickname}
            updateMember={updateMember}
            toggleSetting={toggleSetting}
          />
        ) : (
          <div className='flex w-full justify-between items-start'>
            <span className='font-bold'>{nickname ?? '익명의 사용자'}</span>
            <Button variant={'primary_semibold'} onClick={toggleSetting}>
              설정
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

type NickNameFieldProp = {
  nickname?: string;
  updateMember: (member: Member) => void;
  toggleSetting: () => void;
};

function NicknameFormFiled({
  nickname,
  updateMember,
  toggleSetting,
}: NickNameFieldProp) {
  const form = useForm<NicknameForm>({
    resolver: zodResolver(NicknameSchema),
    defaultValues: {
      nickname: nickname ?? '',
    },
  });

  const onSubmit = async (data: NicknameForm) => {
    try {
      const updated = await updateNickname(data);
      console.log('Member: >>> ', JSON.stringify(updated));
      updateMember(updated);
      toggleSetting();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full flex flex-col justify-end gap-2'
      >
        <FormField
          control={form.control}
          name='nickname'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  autoComplete='nickname'
                  {...field}
                  className='font-semibold'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end gap-3'>
          <Button
            type='button'
            variant={'ghost_semibold'}
            onClick={toggleSetting}
          >
            취소
          </Button>
          <Button type='submit' variant={'secondary_semibold'}>
            확인
          </Button>
        </div>
      </form>
    </Form>
  );
}
