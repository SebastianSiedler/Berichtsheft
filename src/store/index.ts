import { store } from 'quasar/wrappers';
import { InjectionKey } from 'vue';
import createPersistedState from 'vuex-persistedstate';
import {
  createStore,
  Store as VuexStore,
  useStore as vuexUseStore,
} from 'vuex';

// Import Modules
import auth from './modules/authentication/index';
import { AuthStateInterface } from './modules/authentication/types';

import settings, { SettingsStateInterface } from './modules/settings/index';

export interface StateInterface {
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  auth: AuthStateInterface;
  settings: SettingsStateInterface;
}

export const Store = createStore<StateInterface>({
  modules: {
    auth,
    settings,
  },

  plugins: [
    createPersistedState({
      paths: ['auth.user'],
    }),
  ],

  // enable strict mode (adds overhead!)
  // for dev mode and --debug builds only
  strict: !!process.env.DEBUGGING,
});

export default store(function (/* { ssrContext } */) {
  return Store;
});

export function useStore() {
  return vuexUseStore(storeKey);
}

// provide typings for `this.$store`
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: VuexStore<StateInterface>;
  }
}

// provide typings for `useStore` helper
export const storeKey: InjectionKey<VuexStore<StateInterface>> =
  Symbol('vuex-key');
