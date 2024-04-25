import React, { createContext, useContext, useState } from 'react';

const WorkspaceIdContext = createContext();

export function WorkspaceIdProvider({ children }) {
  const [workspaceId, setWorkspaceId] = useState(null);

  return (
    <WorkspaceIdContext.Provider value={{ workspaceId, setWorkspaceId }}>
      {children}
    </WorkspaceIdContext.Provider>
  );
}

export function useWorkspaceId() {
  return useContext(WorkspaceIdContext);
}