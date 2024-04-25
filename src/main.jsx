import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import Root from './routes/root';
import ErrorPage from './pages/error-page';
import '@fontsource/inter';

import DownloadProjectAssets from './routes/DownloadProjectAssets';
import DownloadProjectAnnotations from './routes/DownloadProjectAnnotations';
import DownloadProjectNotes from './routes/DownloadProjectNotes';
import DownloadWorkspaceScreens from './routes/DownloadWorkspaceScreens';
import DownloadStyleguideIcons from './routes/DownloadStyleguideIcons';
import GenerateTailwindTheme from './routes/GenerateTailwindTheme';
import Login from './routes/Login';
import { AuthorizeProvider, useAuthorize } from './providers/AuthorizeProvider';

const privateRouter = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'download-project-assets',
        element: <DownloadProjectAssets />,
      },
      {
        path: 'download-project-annotations',
        element: <DownloadProjectAnnotations />,
      },
      {
        path: 'download-project-notes',
        element: <DownloadProjectNotes />,
      },
      {
        path: 'download-workspace-screens',
        element: <DownloadWorkspaceScreens />,
      },
      {
        path: 'download-styleguide-icons',
        element: <DownloadStyleguideIcons />,
      },
      {
        path: 'generate-tailwind-theme',
        element: <GenerateTailwindTheme />,
      },
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
]);

const publicRouter = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
]);

function Main() {
  const [isAuthorized] = useAuthorize();
  return <RouterProvider router={isAuthorized ? privateRouter : publicRouter} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
   <CssBaseline />
    <AuthorizeProvider>
      <Main />
    </AuthorizeProvider>
  </>,
);
