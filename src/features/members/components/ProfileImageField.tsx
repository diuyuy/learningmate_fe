import ProfileAvartarImage from '@/components/ProfileAvartarImage';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AvatarImage } from '@radix-ui/react-avatar';
import { useEffect, useReducer, useState, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { updateProfileImage } from '../api/api';
import { ImageFormSchema, type ImageForm, type Member } from '../types/types';

type Props = {
  imgUrl?: string;
  updateMember: (member: Member) => void;
};

export default function ProfileImageField({ imgUrl, updateMember }: Props) {
  const [isForm, toggleSetting] = useReducer((pre) => !pre, false);

  return isForm ? (
    <ProfileImageFormField
      imgUrl={imgUrl}
      toggleSetting={toggleSetting}
      updateMember={updateMember}
    />
  ) : (
    <div className='flex flex-col items-center text-center w-full gap-3'>
      <Avatar className='h-28 w-28 ring-2 ring-yellow-400 ring-offset-2 ring-offset-white'>
        <ProfileAvartarImage imgUrl={imgUrl} />
      </Avatar>
      <Button
        variant='outline_semibold'
        size='sm'
        onClick={toggleSetting}
        className='rounded-lg'
      >
        변경
      </Button>
    </div>
  );
}

type ProfileImgFieldProps = Props & { toggleSetting: () => void };

function ProfileImageFormField({
  imgUrl,
  toggleSetting,
  updateMember,
}: ProfileImgFieldProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<ImageForm>({ resolver: zodResolver(ImageFormSchema) });

  const onSubmit = async (data: ImageForm) => {
    try {
      const imgFile = data.image[0];
      const formData = new FormData();
      formData.append('image', imgFile);

      const updatedMember = await updateProfileImage(formData);
      updateMember(updatedMember);
      toggleSetting();
    } catch {
      form.setError('image', {
        message: '이미지 업로드에 실패했습니다. 다시 시도해주세요.',
      });
    }
  };

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0];
    if (!imgFile) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(imgFile));
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className='flex flex-col items-center text-center w-full gap-3'>
      <Avatar className='h-28 w-28 ring-2 ring-yellow-400 ring-offset-2 ring-offset-white'>
        {!previewUrl ? (
          <ProfileAvartarImage imgUrl={imgUrl} />
        ) : (
          <AvatarImage src={previewUrl} />
        )}
      </Avatar>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col items-center gap-2'
        >
          <FormField
            control={form.control}
            name='image'
            render={({ field: { onChange, ...rest } }) => (
              <FormItem className='flex flex-col items-center gap-1'>
                <Button
                  variant='outline_semibold'
                  size='sm'
                  asChild
                  className='rounded-lg'
                >
                  <FormLabel>파일 선택</FormLabel>
                </Button>
                <FormControl>
                  <input
                    type='file'
                    accept='image/png, image/jpeg, image/jpg'
                    onChange={(e) => {
                      onImageChange(e);
                      onChange(e.target.files);
                    }}
                    {...rest}
                    value={undefined}
                    className='hidden'
                  />
                </FormControl>
                <FormMessage />
                <div className='text-xs text-neutral-500 leading-4'>
                  <p>* png, jpg, jpeg</p>
                  <p>* 1MB 이하</p>
                </div>
              </FormItem>
            )}
          />

          <div className='flex gap-2 mt-1'>
            <Button
              type='button'
              variant='ghost_semibold'
              size='sm'
              onClick={toggleSetting}
            >
              취소
            </Button>
            <Button type='submit' variant='secondary_semibold' size='sm'>
              저장
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
