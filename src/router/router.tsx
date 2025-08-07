import RootLayout from '@/layouts/RootLayout';
import ArticleDetailPage from '@/pages/ArticleDetailPage';
import ErrorPage from '@/pages/ErrorPage';
import LandingPage from '@/pages/LandingPage';
import LearningPage from '@/pages/LearningPage';
import LoginPage from '@/pages/LoginPage';
import MainPage from '@/pages/MainPage';
import MyPage from '@/pages/MyPage';
import SignupPage from '@/pages/SignupPage';
import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: 'learning',
        element: <LearningPage />,
      },
      {
        path: 'article/:articleId',
        element: <ArticleDetailPage />,
      },
      {
        path: 'my',
        element: <MyPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
    ],
  },
  {
    path: '/landing',
    element: <LandingPage />,
  },
]);
