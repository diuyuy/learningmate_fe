import { use } from 'react';
import { SessionContext } from './SessionContext';

export const useSession = () => use(SessionContext);
