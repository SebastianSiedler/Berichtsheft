import { _axios as $api } from 'boot/axios';
import { AxiosResponse } from 'axios';
import { GetUserInfoAPI } from './types';
import { Store as $store } from 'src/store/index';
import { AuthMutations } from 'src/store/modules/authentication/mutations';

/**
 * Wird einmalig nach dem Login bzw. Page Init abgefragt
 */
const getUserInfo = async () => {
  const { data }: AxiosResponse<GetUserInfoAPI> = await $api.get(
    '/api/personal/get_user_info/'
  );

  return data;
};

/**
 * Schreibt die Daten von User Info List in den Vuex Store
 */
export const initUserData = async () => {
  const userData = await getUserInfo();
  $store.commit(AuthMutations.SET_USERINFO, userData);
};
