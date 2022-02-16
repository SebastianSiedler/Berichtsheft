import { _axios as $api } from 'boot/axios';
//import { AxiosResponse } from 'axios';

/**
 * Wenn der Admin erstmalig einen Tenant für das Unternehmen anlegt
 * Ersten Manager Account aktivieren.
 */
export const sendActivationRequest = async (token: string) => {
  await $api.post('/api/auth/activate_account/', { token });
};

/**
 * User bekommt eine Email in der ein Link zum password Reset drin ist
 */
export const sendResetPasswordMail = async (mail: string) => {
  await $api.post('/api/auth/request_token_password_reset/', {
    username: mail,
  });
};

/**
 * User Account aktivieren.
 * Hierfür muss ein erstes Passwort gesetzt werden
 *
 * wenn newUser == true => wird activate_account_and_set_password
 * benutzt
 */
export const setUserPassword = async (
  token: string,
  password: string,
  newUser?: boolean
) => {
  const url = newUser
    ? 'activate_account_and_set_password'
    : 'token_password_reset';
  await $api.post(`/api/auth/${url}/`, {
    token,
    password,
  });
};
