import React, { createContext, useContext, useState } from 'react';
import { ZeplinApi, Configuration } from '@zeplin/sdk';
// Create context
export const ZeplinClientContext = createContext();

// Custom hook to access Zeplin client context
export const useZeplinClient = () => useContext(ZeplinClientContext);

// Provider component to supply Zeplin client instance
export const ZeplinClientProvider = ({ children }) => {
    const [zeplinClient, setZeplinClient] = useState(null);

    // Initialize Zeplin client when access token is available
    useState(() => {
        const accessToken = localStorage.getItem('zeplinAccessToken');
        if (accessToken) {
            const client = new ZeplinApi(new Configuration({ accessToken }));
            setZeplinClient(client);
        }
    }, []);

    return (
        <ZeplinClientContext.Provider value={{ zeplinClient, setZeplinClient }}>
            {children}
        </ZeplinClientContext.Provider>
    );
};
