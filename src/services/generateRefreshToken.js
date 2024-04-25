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
    return refreshTokenResponse;
  } catch (error) {
    localStorage.removeItem('zeplinAccessToken');
    localStorage.removeItem('zeplinRefreshToken');
    console.log('clearing refresh and access tokens');
    console.error('Error refreshing access token:', error);
    throw error;
  }
}

export default generateRefreshToken;
