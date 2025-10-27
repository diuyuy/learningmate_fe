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

  return (
    <>
      <div className='flex items-start'>
        <div className='w-28 font-semibold'>이미지: </div>
        {isForm ? (
          <ProfileImageFormField
            imgUrl={imgUrl}
            toggleSetting={toggleSetting}
            updateMember={updateMember}
          />
        ) : (
          <div className='flex w-full justify-between items-start'>
            <Avatar className='w-28 h-28'>
              <ProfileAvartarImage imgUrl={imgUrl} />
            </Avatar>
            <Button variant={'primary_semibold'} onClick={toggleSetting}>
              설정
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

type ProfileImgFieldProps = Props & { toggleSetting: () => void };

function ProfileImageFormField({
  imgUrl,
  toggleSetting,
  updateMember,
}: ProfileImgFieldProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<ImageForm>({
    resolver: zodResolver(ImageFormSchema),
  });

  const onSubmit = async (data: ImageForm) => {
    try {
      const imgFile = data.image[0];
      const formData = new FormData();
      formData.append('image', imgFile);

      const updatedMember = await updateProfileImage(formData);
      updateMember(updatedMember);
      toggleSetting();
    } catch (error) {
      form.setError('image', {
        message: '이미지 업로드에 실패했습니다. 다시 시도해주세요.',
      });
    }
  };

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0];
    if (imgFile) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const newUrl = URL.createObjectURL(imgFile);
      setPreviewUrl(newUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    };
  }, [previewUrl]);

  return (
    <div className='flex w-full gap-2 items-start'>
      <Avatar className='w-28 h-28'>
        {!previewUrl ? (
          <ProfileAvartarImage imgUrl={imgUrl} />
        ) : (
          <AvatarImage src={previewUrl} />
        )}
      </Avatar>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex w-full justify-between items-start'
        >
          <FormField
            control={form.control}
            name='image'
            render={({ field: { onChange, ...fieldRest } }) => (
              <FormItem>
                <div>
                  <Button variant={'outline_semibold'} asChild>
                    <FormLabel>변경</FormLabel>
                  </Button>
                </div>
                <FormControl>
                  <input
                    type='file'
                    accept='image/png, image/jpeg, image/jpg'
                    aria-label='프로필 이미지 업로드'
                    onChange={(e) => {
                      onImageChange(e);
                      onChange(e.target.files);
                    }}
                    {...fieldRest}
                    value={undefined}
                    className='hidden'
                  />
                </FormControl>
                <FormMessage />
                <div className='text-gray-500'>
                  <p>* png, jpg, jpeg의 확장자</p>
                  <p>* 1MB 이하의 이미지 </p>
                </div>
              </FormItem>
            )}
          />
          <div className='flex items-start gap-2'>
            <Button
              type='button'
              variant={'ghost_semibold'}
              onClick={toggleSetting}
            >
              취소
            </Button>
            <Button type='submit' variant={'secondary_semibold'}>
              저장
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
