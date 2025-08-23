import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import { RouterProvider } from 'react-router';
import SessionProvider from './features/auth/context/SessionProvider';
import './index.css';
import QueryProvider from './providers/QueryProvider';
import { router } from './router/router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IntlProvider locale='ko-KR'>
      <QueryProvider>
        <SessionProvider>
          <RouterProvider router={router} />
        </SessionProvider>
      </QueryProvider>
    </IntlProvider>
  </StrictMode>
);
