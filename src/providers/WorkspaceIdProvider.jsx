import React, { createContext, useContext, useState } from 'react';

const WorkspaceIdContext = createContext();

export function WorkspaceIdProvider({ children }) {
  const [workspaceId, setWorkspaceId] = useState(null);

  const updateWorkspaceId = (id) => {
    setWorkspaceId(id);
  };

  return (
    <WorkspaceIdContext.Provider value={{ workspaceId, updateWorkspaceId }}>
      {children}
    </WorkspaceIdContext.Provider>
  );
}

export function useWorkspaceId() {
  return useContext(WorkspaceIdContext);
}
