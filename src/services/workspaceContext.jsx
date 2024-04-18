import React, { createContext, useContext, useState } from 'react';

// Create a context object
const WorkspaceIdContext = createContext();

// Export a provider component
export function WorkspaceIdProvider({ children }) {
  const [workspaceId, setWorkspaceId] = useState('');

  return (
    <WorkspaceIdContext.Provider value={{ workspaceId, setWorkspaceId }}>
      {children}
    </WorkspaceIdContext.Provider>
  );
}

// Export a custom hook to consume the context
export function useWorkspaceId() {
  return useContext(WorkspaceIdContext);
}
