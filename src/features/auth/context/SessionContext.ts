import type { Member } from '@/features/members/types/types';
import { createContext } from 'react';

type SessionContextProps = {
  isLoggedIn: boolean;
  toLoginPage: boolean;
  member: Member | null;
  logout: () => void;
  provideSession: (member: Member) => void;
  updateMember: (member: Member) => void;
  onAccountDeleted: () => void;
};

export const SessionContext = createContext<SessionContextProps>({
  isLoggedIn: false,
  toLoginPage: false,
  member: null,
  logout: () => {},
  provideSession: () => {},
  updateMember: () => {},
  onAccountDeleted: () => {},
});
