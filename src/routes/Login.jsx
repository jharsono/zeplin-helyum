import React, { useState, useEffect } from 'react';
import { ZeplinApi } from '@zeplin/sdk';
import { useSearchParams } from 'react-router-dom';
import * as localStorage from '../services/localStorage';
import { useAuthorize } from '../providers/AuthorizeProvider';

const { VITE_ZEPLIN_CLIENT_ID } = import.meta.env;
const zeplin = new ZeplinApi();

function Login() {
  const [, setIsAuthorized] = useAuthorize();
  const [redirectUrl, setRedirectUrl] = useState('');
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  function generateCodeVerifier() {
    const cache = localStorage.getCodeVerifier();
    if (cache) {
      return cache;
    }

    const codeVerifierLength = 128;
    const codeVerifierArray = new Uint8Array(codeVerifierLength);
    crypto.getRandomValues(codeVerifierArray);
    const codeVerifier = Array.from(codeVerifierArray)
      .map((byte) => String.fromCharCode(byte))
      .join('')
      .replace(/[^A-Za-z0-9]/g, ''); // Remove non-alphanumeric characters

    localStorage.setCodeVerifier(codeVerifier);
    return codeVerifier;
  }

  useEffect(() => {
    if (!code) {
      return;
    }
    async function getAccessToken() {
      try {
        const codeVerifier = localStorage.getCodeVerifier();
        if (!codeVerifier) {
          console.error('Code verifier not found in local storage');
          return;
        }
        const createTokenResponse = await zeplin.authorization.createToken({
          code,
          clientId: VITE_ZEPLIN_CLIENT_ID,
          redirectUri: 'http://localhost:5173/',
          codeVerifier,
        });
        const { accessToken, refreshToken } = createTokenResponse.data;
        localStorage.setAccessToken(accessToken);
        localStorage.setRefreshToken(refreshToken);
        setIsAuthorized(true);
      } catch (error) {
        console.error('Error getting access token:', error);
      }
    }
    getAccessToken();
  }, [code, setIsAuthorized]);

  useEffect(() => {
    setRedirectUrl(zeplin.authorization.getAuthorizationUrl({
      clientId: VITE_ZEPLIN_CLIENT_ID,
      redirectUri: 'http://localhost:5173',
      codeChallenge: generateCodeVerifier(),
      codeChallengeMethod: 'plain',
    }));
  }, []);

  return (
    <div className="card">
      <button type="button">
        <a href={redirectUrl}>Login</a>
      </button>
    </div>
  );
}

export default Login;
