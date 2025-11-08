import AuthLayout from '@/layouts/AuthLayout';
import ProtectedRoute from '@/layouts/ProtectedRoute';
import RootLayout from '@/layouts/RootLayout';
import AdminPage from '@/pages/AdminPage';
import ArticleDetailPage from '@/pages/ArticleDetailPage';
import EditArticlePage from '@/pages/EditArticlePage';
import ErrorPage from '@/pages/ErrorPage';
import IndexPage from '@/pages/IndexPage';
import LandingPage from '@/pages/LandingPage';
import LearningPage from '@/pages/LearningPage';
import LoginPage from '@/pages/LoginPage';
import MainPage from '@/pages/MainPage';
import MyPage from '@/pages/MyPage';
import OauthRedirectPage from '@/pages/OauthRedirectPage';
import PasswordResetsPage from '@/pages/PasswordResetsPage';
import RequestPasswdResetsPage from '@/pages/RequestPasswdResetsPage';
import SignupPage from '@/pages/SignupPage';
import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/landing',
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <RootLayout />,
        children: [
          {
            path: '/main',
            element: <MainPage />,
          },
          {
            path: '/learning',
            element: <LearningPage />,
          },
          {
            path: '/article/:articleId',
            element: <ArticleDetailPage />,
          },
          {
            path: '/my',
            element: <MyPage />,
          },
          {
            path: '/admin',
            element: <AdminPage />,
          },
          {
            path: 'admin/keywords/:keywordId/articles/:articleId',
            element: <EditArticlePage />,
          },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
      {
        path: '/password-resets',
        element: <RequestPasswdResetsPage />,
      },
      {
        path: '/password-resets/update',
        element: <PasswordResetsPage />,
      },
    ],
  },
  {
    path: '/oauth-redirect',
    element: <OauthRedirectPage />,
  },
]);
