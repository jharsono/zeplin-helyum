export function getAccessToken() {
  return localStorage.getItem('zeplinAccessToken');
}

export function setAccessToken(accessToken) {
  localStorage.setItem('zeplinAccessToken', accessToken);
}

export function getRefreshToken() {
  return localStorage.getItem('zeplinRefreshToken');
}

export function setRefreshToken(refreshToken) {
  localStorage.setItem('zeplinRefreshToken', refreshToken);
}

export function clearTokens() {
  localStorage.removeItem('zeplinAccessToken');
  localStorage.removeItem('zeplinRefreshToken');
}

export function getCodeVerifier() {
  return localStorage.getItem('codeVerifier');
}

export function setCodeVerifier(codeVerifier) {
  localStorage.setItem('codeVerifier', codeVerifier);
}
