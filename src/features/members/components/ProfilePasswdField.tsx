import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import PasswordInput from '@/features/auth/components/PasswordInput';
import {
  PasswordResetSchema,
  type PasswordResetFormData,
} from '@/features/auth/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { updatePasswd } from '../api/api';
import type { Member } from '../types/types';

type Props = { updateMember: (member: Member) => void };

export default function ProfilePasswdField({ updateMember }: Props) {
  const [isForm, toggleSetting] = useReducer((pre) => !pre, false);

  return isForm ? (
    <ProfilePasswordFormField
      updateMember={updateMember}
      toggleSetting={toggleSetting}
    />
  ) : (
    <div className='flex w-full items-start justify-between'>
      <span className='select-none tracking-wider'>************</span>
      <Button
        variant={'outline_semibold'}
        onClick={toggleSetting}
        className='rounded-lg'
      >
        변경
      </Button>
    </div>
  );
}

type PasswdFieldProps = {
  updateMember: (member: Member) => void;
  toggleSetting: () => void;
};

function ProfilePasswordFormField({
  updateMember,
  toggleSetting,
}: PasswdFieldProps) {
  const form = useForm<PasswordResetFormData>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: { password: '', password2: '' },
  });

  const onSubmit = async (data: PasswordResetFormData) => {
    try {
      const member = await updatePasswd({ password: data.password });
      updateMember(member);
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
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm font-semibold'>
                새 비밀번호
              </FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete='password'
                  placeholder='비밀번호를 입력하세요...'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password2'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm font-semibold'>
                새 비밀번호 확인
              </FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete='password'
                  placeholder='비밀번호를 입력하세요...'
                  {...field}
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
            비밀번호 변경
          </Button>
        </div>
      </form>
    </Form>
  );
}
