import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import { RouterProvider } from 'react-router';
import SessionProvider from './features/auth/context/SessionProvider';
import './index.css';
import QueryProvider from './providers/QueryProvider';
import { router } from './router/router';
import { useKstMidnightRollover } from './lib/useKstMidnightRollover';

function GlobalRolloverProvider() {
  useKstMidnightRollover(); // KST 자정마다 키워드/리뷰/캘린더 invalidate
  return <RouterProvider router={router} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IntlProvider locale='ko-KR'>
      <QueryProvider>
        <SessionProvider>
          <GlobalRolloverProvider />
        </SessionProvider>
      </QueryProvider>
    </IntlProvider>
  </StrictMode>
);
