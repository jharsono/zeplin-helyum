import React, {
  useState, useEffect, useCallback,
} from 'react';
import { ZeplinApi, Configuration } from '@zeplin/sdk';

const { VITE_ZEPLIN_CLIENT_ID, VITE_ZEPLIN_CLIENT_SECRET } = import.meta.env;

let zeplin = new ZeplinApi();

const redirectUrl = zeplin.authorization.getAuthorizationUrl({
  clientId: VITE_ZEPLIN_CLIENT_ID,
  redirectUri: 'http://localhost:5173/',
});

function Login() {
  const [code, setCode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [accessTokenAcquired, setAccessTokenAcquired] = useState(false);
  const [username, setUsername] = useState('');

  const extractCodeFromURL = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code');
    if (codeParam) {
      setCode(codeParam);
      setIsAuthorized(true);
    }
  }, []);

  const getAccessToken = useCallback(async () => {
    try {
      const createTokenResponse = await zeplin.authorization.createToken({
        code,
        clientId: VITE_ZEPLIN_CLIENT_ID,
        clientSecret: VITE_ZEPLIN_CLIENT_SECRET,
        redirectUri: 'http://localhost:5173/',
      });
      const { accessToken, refreshToken } = createTokenResponse.data;
      zeplin = new ZeplinApi(new Configuration({ accessToken }));
      localStorage.setItem('zeplinAccessToken', accessToken);
      localStorage.setItem('zeplinRefreshToken', refreshToken);
      setAccessTokenAcquired(true);
      // Update the Zeplin client context for access in other parts of app
    } catch (error) {
      console.error('Error getting access token:', error);
    }
  }, [code]);

  const redirectToRoot = useCallback(() => {
    window.location.href = '/';
  }, []);

  useEffect(() => {
    if (!isAuthorized) {
      extractCodeFromURL();
    }
    if (code && !accessTokenAcquired) {
      getAccessToken();
    }
    if (accessTokenAcquired) {
      redirectToRoot();
    }
  }, [
    isAuthorized,
    code,
    accessTokenAcquired,
    extractCodeFromURL,
    getAccessToken,
    redirectToRoot,
  ]);

  useEffect(() => {
    if (!isAuthorized) {
      extractCodeFromURL();
    }
    if (code && !accessTokenAcquired) {
      getAccessToken();
    }
    if (accessTokenAcquired) {
      redirectToRoot();
    }
  }, [
    isAuthorized,
    code,
    accessTokenAcquired,
    extractCodeFromURL,
    getAccessToken,
  ]);

  return (
    <>
      {accessTokenAcquired && <div className="card">{username}</div>}
      {!accessTokenAcquired && (
        <div className="card">
          <button>
            <a href={redirectUrl}>Login</a>
          </button>
        </div>
      )}
    </>
  );
}

export default Login;
