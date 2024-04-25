import React, { useState, useEffect } from 'react';
import { ZeplinApi } from '@zeplin/sdk';
import axios from 'axios';
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
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~';
    const codeVerifier = Array.from(crypto.getRandomValues(new Uint8Array(64)))
      .map((x) => characters[x % characters.length])
      .join('');
    localStorage.setCodeVerifier(codeVerifier); // Save code verifier to local storage
    console.log('Code Verifier:', codeVerifier);
    return codeVerifier;
  }

  function generateCodeChallenge(codeVerifier) {
    return new Promise((resolve, reject) => {
      crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier))
        .then((buffer) => {
          const hashArray = Array.from(new Uint8Array(buffer));
          const hashBase64 = btoa(hashArray.map((b) => String.fromCharCode(b)).join(''));
          const codeChallenge = hashBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
          console.log('Code Challenge:', codeChallenge);
          resolve(codeChallenge);
        })
        .catch(reject);
    });
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

        const tokenResponse = await axios.post('https://api.zeplin.dev/v1/oauth/token', {
          code,
          client_id: VITE_ZEPLIN_CLIENT_ID,
          redirect_uri: 'http://localhost:5173/',
          code_verifier: codeVerifier,
          grant_type: 'authorization_code',
        });

        const { accessToken, refreshToken } = tokenResponse.data;
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
    const codeVerifier = localStorage.getCodeVerifier() || generateCodeVerifier();
    generateCodeChallenge(codeVerifier).then((codeChallenge) => {
      setRedirectUrl(() => {
        const authorizationParams = new URLSearchParams({
          client_id: VITE_ZEPLIN_CLIENT_ID,
          redirect_uri: 'http://localhost:5173',
          code_challenge_method: 'S256',
          code_challenge: codeChallenge,
          response_type: 'code',
        });
      
        return `https://api.zeplin.dev/v1/oauth/authorize?${authorizationParams.toString()}`;
      });
    });
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
