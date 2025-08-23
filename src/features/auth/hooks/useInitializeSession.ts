import type { Member } from '@/features/members/types/types';
import { setInterceptors } from '@/lib/axios';
import { useEffect } from 'react';
import { fetchMember } from '../api/api';

export const useInitializeSessoin = (
  logout: () => void,
  provideSession: (member: Member) => void
) => {
  useEffect(() => {
    setInterceptors(logout);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const member = await fetchMember();

        provideSession(member);
      } catch (error) {}
    })();
  }, []);
};
