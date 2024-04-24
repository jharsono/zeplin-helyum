import React, { createContext, useContext, useState } from 'react';
import { getAccessToken } from '../services/localStorage';

const AuthorizeContext = createContext();

export function AuthorizeProvider({ children }) {
  const state = useState(Boolean(getAccessToken()));

  return (
    <AuthorizeContext.Provider value={state}>
      {children}
    </AuthorizeContext.Provider>
  );
}

export function useAuthorize() {
  return useContext(AuthorizeContext);
}
