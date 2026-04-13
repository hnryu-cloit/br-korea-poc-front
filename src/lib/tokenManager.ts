const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

function readToken(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(key);
}

function writeToken(key: string, value: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, value);
}

function removeToken(key: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(key);
}

export function getAccessToken() {
  return readToken(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  writeToken(ACCESS_TOKEN_KEY, token);
}

export function getRefreshToken() {
  return readToken(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string) {
  writeToken(REFRESH_TOKEN_KEY, token);
}

export function clearTokens() {
  removeToken(ACCESS_TOKEN_KEY);
  removeToken(REFRESH_TOKEN_KEY);
}
