import { ActionTree } from 'vuex';
import { AuthStateInterface } from './types';
import { StateInterface } from 'src/store/index';

export const actions: ActionTree<AuthStateInterface, StateInterface> = {
  loadAPIResult(): void {
    console.log('asdf');
  },
};
