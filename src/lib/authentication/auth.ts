import { _axios as $api } from 'boot/axios';
import { AxiosResponse } from 'axios';
import $router from 'src/router/index';
import { Store as $store } from 'src/store/index';
import { AuthMutations } from 'src/store/modules/authentication/mutations';
import { AuthJWT } from './types';
import { initUserData } from 'lib/personal/personal';

/**
 * Sendet Username und Passwort an die API und bekommt
 * Access und Refresh Token zurück
 */
export const Login = async (username: string, password: string) => {
  const { data }: AxiosResponse<AuthJWT> = await $api.post(
    '/api/auth/auth-jwt/',
    {
      username: username,
      password: password,
    }
  );

  setAccessToken(data.access);
  setRefreshToken(data.refresh);
  initUserData();
  $store.commit(AuthMutations.SET_ISAUTHENTICATED, true);
  $router.replace('/dashboard');
};

/**
 * Wird beim Öffnen der Website einmalig ausgeführt, und überprüft,
 * ob der User bereits noch angemeldet ist oder nicht
 */
export const SetInitialData = async () => {
  console.log('setInitialData()');

  // Wenn refreshToken null ist -> wahrscheinlich erster Seitenaufruf überhaupt
  if (getRefreshToken() == null) {
    $store.commit(AuthMutations.SET_ISAUTHENTICATED, false);
  } else {
    try {
      await refreshAccessToken();
      await initUserData();
    } catch (e) {
      console.log(e);
    }
  }
};

/**
 * Meldet den User ab und löscht den Cache
 */
export const signOut = async (reason?: string) => {
  console.log('signOut');
  localStorage.clear();
  $store.commit(AuthMutations.SET_ISAUTHENTICATED, false);

  await $router.replace({ path: '/login', query: { reason } });

  // Mit await, damit nicht bei Angemeldeter user info 'null' steht
  $store.commit(AuthMutations.RESET_USERINFO);
};

/**
 * Refresh Token in Local Storage schreiben
 */
const setRefreshToken = (token: string) => {
  localStorage.setItem('RefreshToken', token);
};

/**
 * Refresh Token aus Local Storage holen
 */
const getRefreshToken = () => {
  return localStorage.getItem('RefreshToken');
};

const setAccessToken = (token: string) => {
  $store.commit(AuthMutations.SET_ACCESSTOKEN, token);
};

export const getAccessToken = () => {
  return $store.state.auth.AccessToken;
};

/**
 *
 */
export const refreshAccessToken = async () => {
  try {
    // Get Refresh Token
    const refreshToken = getRefreshToken();

    // Versuche den Token zu refreshen -> Validieren kann man sich deshalb sparen
    const { data }: AxiosResponse<AuthJWT> = await $api.post(
      'api/auth/auth-jwt-refresh/',
      {
        refresh: refreshToken,
      }
    );
    setAccessToken(data.access);
    setRefreshToken(data.refresh);
    $store.commit(AuthMutations.SET_ISAUTHENTICATED, true);
  } catch (e) {
    console.log(e);
    if (e != 'Netzwerkfehler: Server nicht erreichbar') {
      signOut();
    }
  }
};
