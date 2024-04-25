import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import WorkspaceSelector from '../components/WorkspaceSelector';
import { WorkspaceIdProvider } from '../providers/WorkspaceIdProvider';

const pages = [
  {
    route: 'download-project-annotations',
    title: 'Download Project Annotations',
  },
  {
    route: 'download-project-notes',
    title: 'Download Project Notes',
  },
  {
    route: 'download-project-assets',
    title: 'Download Project Assets',
  },
  {
    route: 'download-styleguide-icons',
    title: 'Download Styleguide Icons',
  },
  {
    route: 'download-workspace-screens',
    title: 'Download Workspace Screens',
  },
  {
    route: 'generate-tailwind-theme',
    title: 'Generate Tailwind Theme',
  },
];

export default function Root() {
  return (
    <WorkspaceIdProvider>
      <div id="sidebar">
        <WorkspaceSelector />
        <nav>
          <ul>
            {
                pages.map((page) => (
                  <li key={page.route}>
                    <Link to={page.route}>{page.title}</Link>
                  </li>
                ))
              }
          </ul>
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </WorkspaceIdProvider>
  );
}
