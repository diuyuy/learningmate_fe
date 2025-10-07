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
import { Input } from '@/components/ui/input';
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
          <ProfileImageFormFiled
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

function ProfileImageFormFiled({
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
    } catch (error) {}
  };

  const onImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void
  ) => {
    const imgFile = e.target.files?.[0];
    if (imgFile) {
      const newUrl = URL.createObjectURL(imgFile);
      setPreviewUrl(newUrl);
    }
    onChange(e.target.files);
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
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={(e) => {
                      onImageChange(e, onChange);
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
