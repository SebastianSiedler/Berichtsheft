import { _axios as $api } from 'boot/axios';
import { AxiosResponse } from 'axios';
import { SingleUser, InitUser } from './types';
import { getTemplatesOverview } from 'lib/admin/templates/templates';

export const getUserDetailsAPI = async (userId: number) => {
  const { data }: AxiosResponse<SingleUser> = await $api.get(
    `/api/admin/user/${userId}/`
  );
  return data;
};

export const saveUserApi = async (user: SingleUser) => {
  if (user.id === -1) {
    const { data }: AxiosResponse<{ id: number }> = await $api.post(
      '/api/admin/user/',
      user
    );
    return data.id;
  } else {
    await $api.patch(`/api/admin/user/${user.id}/`, user);
    return user.id;
  }
};

/**
 * Übersicht Tabelle/Liste aller User
 */
const getUserOverviewApi = async () => {
  const { data }: AxiosResponse<InitUser[]> = await $api.get(
    '/api/admin/user_manager_overview'
  );

  return data;
};

/**
 * Wird beim initialen Laden bzw. OnMount der User Tabelle geladen
 * => Alle User + Templates
 */
export const initUsersApi = async () => {
  const [users, templates] = await Promise.all([
    getUserOverviewApi(),
    getTemplatesOverview(),
  ]);

  return {
    users,
    templates,
  };
};

/**
 * User aus der API löschen
 */
export const deleteUserApi = async (userId: number) => {
  await $api.delete(`/api/admin/user/${userId}/`);
};

/**
 * Titel für den Edit Dialog
 */
export const getEditTitle = (userId: number) => {
  return userId === -1 ? 'Neuen User anlegen' : 'User bearbeiten';
};

export const emptyUser: SingleUser = {
  id: -1,
  username: '',
  first_name: '',
  last_name: '',
  salutation: '1',
  is_trainee: false,
  is_manager: false,
  is_trainer: false,
  is_teamleader: false,
  start_year: new Date().getFullYear(),
  template: null,
};
