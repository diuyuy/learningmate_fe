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

  return isForm ? (
    <NicknameFormFiled
      nickname={nickname}
      updateMember={updateMember}
      toggleSetting={toggleSetting}
    />
  ) : (
    <div className='flex w-full items-start justify-between'>
      <span className='truncate text-base font-semibold'>
        {nickname ?? '익명의 사용자'}
      </span>
      <Button
        variant={'outline_semibold'}
        onClick={toggleSetting}
        className='rounded-lg'
      >
        수정
      </Button>
    </div>
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
    defaultValues: { nickname: nickname ?? '' },
  });

  const onSubmit = async (data: NicknameForm) => {
    try {
      const updated = await updateNickname(data);
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
        className='flex w-full flex-col gap-2'
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
        <div className='flex justify-end gap-2'>
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
