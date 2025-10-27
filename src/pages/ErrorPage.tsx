import { Button } from '@/components/ui/button';
import { ROUTE_PATHS } from '@/constants/routepaths';
import { AlertCircle } from 'lucide-react';
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

  const handleGoToMain = () => {
    navigate(ROUTE_PATHS.MAIN);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6 rounded-full bg-destructive/10 p-4">
          <AlertCircle className="size-16 text-destructive" />
        </div>

        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          문제가 발생했습니다
        </h1>

        <p className="mb-8 text-muted-foreground">
          예상치 못한 오류가 발생했습니다. 문제가 지속되면 관리자에게 문의해 주세요.
        </p>

        <Button
          onClick={handleGoToMain}
          size="lg"
          variant="primary_semibold"
          className="min-w-[200px]"
        >
          메인 페이지로 이동
        </Button>
      </div>
    </div>
  );
}
