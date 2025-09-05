import { fetchMember } from '@/features/members/api/api';
import type { Member } from '@/features/members/types/types';
import { setInterceptors } from '@/lib/axios';
import { AxiosError } from 'axios';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { SessionContext } from './SessionContext';

export default function SessionProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [toLoginPage, setToLoginPage] = useState(true);
  const [member, setMember] = useState<Member | null>(null);

  const logout = () => {
    setIsLoggedIn(false);
    setToLoginPage(true);
    setMember(null);
  };

  const onAccountDeleted = () => {
    setIsLoggedIn(false);
    setToLoginPage(false);
    setMember(null);
  };

  const updateMember = (updated: Member) => {
    setMember(updated);
  };

  const provideSession = (member: Member) => {
    setIsLoggedIn(true);
    setToLoginPage(true);
    setMember(member);
  };

  useEffect(() => {
    setInterceptors(logout);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const member = await fetchMember();
        if (member) provideSession(member);
      } catch (error) {
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
        toLoginPage,
        logout,
        provideSession,
        updateMember,
        onAccountDeleted,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
