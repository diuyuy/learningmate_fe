import { fetchMember } from '@/features/members/api/api';
import type { Member } from '@/features/members/types/types';
import { setInterceptors } from '@/lib/axios';
import { useEffect } from 'react';

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
        if (!!member) provideSession(member);
      } catch (error) {
        logout();
      }
    })();
  }, []);
};
