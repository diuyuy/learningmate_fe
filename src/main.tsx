import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import { RouterProvider } from 'react-router';
import './index.css';
import QueryProvider from './providers/QueryProvider';
import { router } from './router/router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IntlProvider locale='ko-KR'>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </IntlProvider>
  </StrictMode>
);
