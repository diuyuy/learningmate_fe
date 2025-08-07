import { isRouteErrorResponse, useRouteError } from 'react-router';
import NotFoundPage from './NotFoundPage';

export default function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404)
    return <NotFoundPage />;

  return <>ErrorPage</>;
}
