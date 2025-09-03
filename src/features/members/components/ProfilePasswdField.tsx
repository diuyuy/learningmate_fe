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
  type PasswordResetForm,
} from '@/features/auth/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { updatePasswd } from '../api/api';
import type { Member } from '../types/types';

type Props = {
  updateMember: (member: Member) => void;
};

export default function ProfilePasswdField({ updateMember }: Props) {
  const [isForm, toggleSetting] = useReducer((pre) => !pre, false);

  return (
    <>
      <div className='flex items-start'>
        <div className='w-28 font-semibold'>비밀번호: </div>
        {isForm ? (
          <ProfilePasswordFormField
            updateMember={updateMember}
            toggleSetting={toggleSetting}
          />
        ) : (
          <div className='flex w-full justify-between items-start'>
            <span className='tracking-widest select-none font-bold'>
              ************
            </span>
            <Button variant={'primary_semibold'} onClick={toggleSetting}>
              설정
            </Button>
          </div>
        )}
      </div>
    </>
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
  const form = useForm<PasswordResetForm>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      password: '',
      password2: '',
    },
  });

  const onSubmit = async (data: PasswordResetForm) => {
    try {
      const member = await updatePasswd({ password: data.password });
      updateMember(member);
      toggleSetting();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full flex flex-col gap-2 justify-end'
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
                <FormLabel className='text-sm font-semibold mt-2'>
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
          <div className='flex gap-2 justify-end'>
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
    </>
  );
}
