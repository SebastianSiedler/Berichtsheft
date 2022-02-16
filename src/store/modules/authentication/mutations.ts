import { GetUserInfoAPI } from 'lib/personal/types';
import { MutationTree } from 'vuex';
import { AuthStateInterface } from './types';
import { emptyUser } from './state';
//import router from 'src/router/index';

export enum AuthMutations {
  SET_STORAGE = 'SET_STORAGE',
  SET_ACCESSTOKEN = 'SET_ACCESSTOKEN',
  SET_ISAUTHENTICATED = 'SET_ISAUTHENTICATED',
  SET_USERINFO = 'SET_USERINFO',
  RESET_USERINFO = 'RESET_USERINFO',
  SET_ASMANAGER = 'SET_ASMANAGER',
}

export const mutations: MutationTree<AuthStateInterface> = {
  [AuthMutations.SET_ACCESSTOKEN](state: AuthStateInterface, token: string) {
    state.AccessToken = token;
  },
  [AuthMutations.SET_ISAUTHENTICATED](
    state: AuthStateInterface,
    isAuth: boolean
  ) {
    state.isAuthenticated = isAuth;
  },

  [AuthMutations.SET_USERINFO](
    state: AuthStateInterface,
    userInfo: GetUserInfoAPI
  ) {
    state.user = userInfo;
  },

  /**
   * Nach dem Signout alle Werte bezüglich des Users auf false
   */
  [AuthMutations.RESET_USERINFO](state: AuthStateInterface) {
    state.user = emptyUser;
  },
};
