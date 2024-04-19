import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
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
import { ZeplinClientProvider } from './services/ZeplinClientContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: localStorage.getItem('zeplinAccessToken') ? <Root /> : <Login />,
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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ZeplinClientProvider>
      <RouterProvider router={router} />
    </ZeplinClientProvider>
  </React.StrictMode>,
);
