import { Module } from 'vuex';
import { StateInterface } from 'src/store/index';
import { AuthStateInterface } from './types';
import state from './state';
import { getters } from './getters';
import { mutations } from './mutations';

const Auth: Module<AuthStateInterface, StateInterface> = {
  state,
  getters,
  mutations,
};

export default Auth;
