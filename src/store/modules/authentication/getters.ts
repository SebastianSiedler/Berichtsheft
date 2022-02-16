import { GetterTree } from 'vuex';
import { AuthStateInterface } from './types';
import { StateInterface } from 'src/store/index';

export const getters: GetterTree<AuthStateInterface, StateInterface> = {
  getUserInfo(state): string {
    return state.user.first_name;
  },
};
