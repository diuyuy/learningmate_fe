import type { Member } from '@/features/members/types/types';
import { createContext } from 'react';

type SessionContextProps = {
  isLoggedIn: boolean;
  member: Member | null;
  logout: () => void;
  provideSession: (member: Member) => void;
  updateMember: (member: Member) => void;
};

export const SessionContext = createContext<SessionContextProps>({
  isLoggedIn: false,
  member: null,
  logout: () => {},
  provideSession: () => {},
  updateMember: () => {},
});
