import { ZeplinApi } from '@zeplin/sdk';

const zeplin = new ZeplinApi();

async function generateRefreshToken(clientId, clientSecret) {
  try {
    const refreshTokenResponse = await zeplin.authorization.refreshToken({
      refreshToken: localStorage.getItem('zeplinRefreshToken'),
      clientId,
      clientSecret,
    });
    localStorage.setItem('zeplinRefreshToken', refreshTokenResponse.refreshToken);
    localStorage.setItem('zeplinAccessToken', refreshTokenResponse.accessToken);
  } catch (error) {
    console.error('Error refreshing access token:', error);
  }
}

export default generateRefreshToken;
