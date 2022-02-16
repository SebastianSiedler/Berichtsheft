import { Module } from 'vuex';
import { StateInterface } from 'src/store/index';

export interface SettingsStateInterface {
  asManager: boolean;
}

export enum SettingsMutations {
  SET_ASMANAGER = 'SET_ASMANAGER',
}

const Settings: Module<SettingsStateInterface, StateInterface> = {
  state: {
    asManager: false,
  },
  mutations: {
    [SettingsMutations.SET_ASMANAGER](state, v: boolean) {
      state.asManager = v;
    },
  },
};

export default Settings;
