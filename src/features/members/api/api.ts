import { api } from '@/lib/axios';
import type { Member, PasswdUpdateReq } from '../types/types';

export const fetchMember = async () => {
  const response = await api.get('/members/me');
  return response.data.result as Member;
};

export const fetchProfileImg = async (imgUrl: string) => {
  console.log('🚀 ~ fetchProfileImg ~ imgUrl:', imgUrl);
  const response = await api.get(`/members/profile-images/${imgUrl}`, {
    responseType: 'blob',
  });

  const imgBlob = response.data;

  return URL.createObjectURL(imgBlob);
};

export const updateNickname = async (updated: Pick<Member, 'nickname'>) => {
  const response = await api.patch('/members/me', updated);

  return response.data.result as Member;
};

export const updatePasswd = async (newPasswd: PasswdUpdateReq) => {
  const response = await api.patch('/members/me', newPasswd);

  return response.data.result as Member;
};

export const updateProfileImage = async (image: FormData) => {
  const response = await api.patch('/members/me/profile-image', image);

  return response.data.result as Member;
};

export const deleteMember = async () => {
  await api.delete('/members/me');
};
