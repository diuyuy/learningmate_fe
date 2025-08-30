import { fetchMember } from '@/features/members/api/api';
import type { Member } from '@/features/members/types/types';
import { setInterceptor } from '@/lib/axios';
import { AxiosError } from 'axios';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { SessionContext } from './SessionContext';

export default function SessionProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [member, setMember] = useState<Member | null>(null);

  const logout = () => {
    setIsLoggedIn(false);
    setMember(null);
  };

  const provideSession = (member: Member) => {
    setIsLoggedIn(true);
    setMember(member);
  };

  useEffect(() => {
    setInterceptor(logout);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const member = await fetchMember();

        provideSession(member);
        console.log('Seesion Set!!!');
      } catch (error) {
        console.error(error);
        if (error instanceof AxiosError && error.status === 401) {
          logout();
        }
      }
    })();
  }, []);

  return (
    <SessionContext.Provider
      value={{
        isLoggedIn,
        member,
        logout,
        provideSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
