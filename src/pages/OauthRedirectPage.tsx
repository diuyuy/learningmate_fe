import { ROUTE_PATHS } from '@/constants/routepaths';
import { useSession } from '@/features/auth/context/useSession';
import { fetchMember } from '@/features/members/api/api';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function OauthRedirectPage() {
  const { provideSession } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const member = await fetchMember();
      provideSession(member);
      navigate(ROUTE_PATHS.MAIN);
    })();
  }, []);

  return null;
}
