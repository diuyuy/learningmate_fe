import { ROUTE_PATHS } from '@/constants/routepaths';
import { AxiosError } from 'axios';
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router';
import NotFoundPage from './NotFoundPage';

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  if (isRouteErrorResponse(error) && error.status === 404)
    return <NotFoundPage />;

  if (error instanceof AxiosError && error.status === 401) {
    alert('세션이 만료되었습니다. 로그인 화면으로 이동합니다.');
    navigate(`/login?callback=${ROUTE_PATHS.LEARNING}`);
  }

  return <>ErrorPage</>;
}
